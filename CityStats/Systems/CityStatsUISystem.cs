using CityStats.Data;
using Colossal.UI.Binding;
using Game.Input;
using Game.UI;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

namespace CityStats.Systems {
    internal partial class CityStatsUISystem : UISystemBase {
        private ProxyAction togglePanelBindingAction;

        private ValueBinding<Vector2> panelPositionBinding;
        private ValueBinding<bool> panelVisibleBinding;

        protected override void OnCreate() {
            base.OnCreate();

            // Mod options bindings
            togglePanelBindingAction = Mod.Settings.GetAction(nameof(CityStatsSettings.TogglePanelBinding));
            togglePanelBindingAction.shouldBeEnabled = true;
            togglePanelBindingAction.onInteraction += OnTogglePanelAction;
            // phases: Performed, Started, Cancelled, Waiting, Disabled

            // Value bindings
            panelVisibleBinding = new ValueBinding<bool>(Mod.NAME, UIBindingData.VALUE_PANEL_VISIBLE, false);
            AddBinding(panelVisibleBinding);
            panelPositionBinding = new ValueBinding<Vector2>(Mod.NAME, UIBindingData.VALUE_PANEL_POSITION, Vector2.zero);
            AddBinding(panelPositionBinding);

            // Trigger bindings
            var togglePanelVisibleTrigger = new TriggerBinding(Mod.NAME, UIBindingData.TRIGGER_TOGGLE_PANEL_VISIBLE, OnTogglePanelVisibilityTrigger);
            AddBinding(togglePanelVisibleTrigger);
            var setPanelVisibleTrigger = new TriggerBinding<bool>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_VISIBLE, OnSetPanelVisibilityTrigger);
            AddBinding(setPanelVisibleTrigger);
            var setPanelPositionTrigger = new TriggerBinding<Vector2>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_POSITION, SetPanelPositionTrigger);
            AddBinding(setPanelPositionTrigger);
        }


        private void OnTogglePanelAction(ProxyAction action, InputActionPhase phase) {
            if (phase != InputActionPhase.Performed) return;

            SetPanelVisiblity(!panelVisibleBinding.value);
            Mod.Log.Debug($"[{togglePanelBindingAction.name}] Toggled panel via keybinding");
        }


        private void OnTogglePanelVisibilityTrigger() {
            SetPanelVisiblity(!panelVisibleBinding.value);
            Mod.Log.Debug($"[OnTogglePanelTrigger] Toggled panel via trigger");
        }


        private void OnSetPanelVisibilityTrigger(bool open) {
            SetPanelVisiblity(open);
            Mod.Log.Debug($"[OnTogglePanelTrigger] Toggled panel via trigger");
        }


        private void SetPanelPositionTrigger(Vector2 position) {
            panelPositionBinding.Update(position);
        }


        private void SetPanelVisiblity(bool open) {
            panelVisibleBinding.Update(open);
        }
    }
}
