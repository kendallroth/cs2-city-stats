import engine from "cohtml/cohtml";
import { useEffect } from "react";

interface CohtmlEventSubscriptionArgs {
  /** Event name */
  event: string;
  /** Event namespace (typically mod name/ID constant) */
  namespace: string;
  /**
   * Event callback
   *
   * NOTE: Ensure this uses a stable reference to avoid continually recreating subscription each render!
   */
  callback: (...args: unknown[]) => void;
}

export const useCohtmlEventSubscription = (args: CohtmlEventSubscriptionArgs) => {
  const { callback, event, namespace } = args;

  const eventPath = `${namespace}.${event}`;

  useEffect(() => {
    const subscription = engine.on(eventPath, callback);

    return () => {
      //
      // engine.off(eventPath, callback);
      subscription.clear();
    };
  }, [callback, eventPath]);
};
