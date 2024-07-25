/*
 * Approximations of CO functionality on top of 'cohtml', intended for learning purposes only!
 */

import engine, { type EventHandle } from "cohtml/cohtml";
import type { BindingListener, ValueSubscription } from "cs2/bindings";
import { useEffect, useMemo, useRef, useState } from "react";

/** Approximation of 'useValue' (from minified GameUI JS bundle) */
const useValue = <T>(binding: ValueBinding<T>): T => {
  const subscription = useMemo(() => binding.subscribe(), [binding]);

  const [value, setValue] = useState(subscription.value);
  const currentValueRef = useRef(value);

  useEffect(() => {
    const handleUpdate = (newValue: T) => {
      // Do empty/comparisons/equality checks

      currentValueRef.current = newValue;
      setValue(newValue);
    };

    handleUpdate(subscription.value);
    subscription.setChangeListener(handleUpdate);

    return () => subscription.dispose();
  }, [subscription]);

  return value;
};

const bindValue = <T>(
  groupName: string,
  eventName: string,
  fallbackValue?: T
): ValueBinding<T> => {
  return new ValueBinding(`${groupName}.${eventName}`, fallbackValue);
};

/** NOTE: Name is an approximation at best, could not find reference and as such derived from usage */
class ValueBindingListener<T> {
  listener: BindingListener<T> | undefined;

  constructor(boundListener?: BindingListener<T>) {
    this.listener = boundListener;
  }

  set(boundListener: BindingListener<T>) {
    this.listener = boundListener;
  }

  call(value: T) {
    if (this.listener) {
      this.listener(value);
    }
  }
}

class ValueBinding<T> {
  fallbackValue: T | undefined;
  listeners: ValueBindingListener<T>[];
  connections: EventHandle[] | null;
  disposed: boolean;
  _value: T | undefined;

  subscribeTrigger: string;
  unsubscribeTrigger: string;
  updateTrigger: string;
  patchTrigger: string;

  constructor(eventPath: string, fallbackValue?: T) {
    this.fallbackValue = fallbackValue;
    this.listeners = [];
    this.connections = null;
    this.disposed = false;

    this.subscribeTrigger = `${eventPath}.subscribe`;
    this.unsubscribeTrigger = `${eventPath}.unsubscribe`;
    this.updateTrigger = `${eventPath}.update`;
    this.patchTrigger = `${eventPath}.patch`;
    this._value = fallbackValue;
  }

  subscribe(inputListener?: BindingListener<T>): ValueSubscription<T> {
    if (this.disposed) {
      throw new Error("cannot subscribe to a disposed binding!");
    }

    this.connect();

    const listener = new ValueBindingListener(inputListener);
    this.listeners.push(listener);

    const thisRef = this;
    return {
      get value() {
        return thisRef.getValueUnsafe();
      },
      setChangeListener: listener.set,
      dispose() {
        const existingListener = thisRef.listeners.indexOf(listener);
        if (existingListener !== -1) {
          thisRef.listeners.splice(existingListener, 1);
          if (thisRef.listeners.length === 0) {
            thisRef.disconnect();
          }
        }
      },
    };
  }

  dispose() {
    this.disposed = true;
    this.listeners.splice(0, this.listeners.length);
    this.disconnect();
  }

  onUpdate(newValue: T) {
    if (newValue !== this._value) {
      this._value = newValue;
      for (const listener of this.listeners) {
        listener.call(newValue);
      }
    }
  }

  onPatch(e: unknown, t: unknown) {
    // NOTE: Skipped
  }

  get value() {
    if (this.connections === null) {
      return this.getValueUnsafe();
    }

    this.connect();
    const unsafeValue = this.getValueUnsafe();
    this.disconnect();
    return unsafeValue;
  }

  connect() {
    if (this.connections === null) {
      this.connections = [
        engine.on(this.updateTrigger, this.onUpdate),
        engine.on(this.patchTrigger, this.onPatch),
      ];

      engine.trigger(this.subscribeTrigger);

      if (this._value === undefined) {
        throw new Error(
          `'${this.updateTrigger}' was not called after subscribe!\nDid you forget to add the binding on the C# side?`
        );
      }
    }
  }

  disconnect() {
    if (this.connections !== null) {
      for (const connection of this.connections) {
        connection.clear();
      }
      this.connections = null;

      engine.trigger(this.unsubscribeTrigger);
      this._value = this.fallbackValue;
    }
  }

  getValueUnsafe() {
    if (this._value === undefined) {
      throw new Error(
        `'${this.updateTrigger}' was not called before getValueUnsafe!`
      );
    }

    return this._value;
  }
}
