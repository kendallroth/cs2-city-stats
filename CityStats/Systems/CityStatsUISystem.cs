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

            Mod.Log.Debug($"{nameof(CityStatsUISystem)} created");

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
            var togglePanelVisibleTrigger = new TriggerBinding(Mod.NAME, UIBindingData.TRIGGER_TOGGLE_PANEL_VISIBLE, TogglePanelVisibility);
            AddBinding(togglePanelVisibleTrigger);
            var setPanelVisibleTrigger = new TriggerBinding<bool>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_VISIBLE, SetPanelVisibility);
            AddBinding(setPanelVisibleTrigger);
            var setPanelPositionTrigger = new TriggerBinding<Vector2>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_POSITION, OnSetPanelPositionTrigger);
            AddBinding(setPanelPositionTrigger);
        }


        private void OnTogglePanelAction(ProxyAction action, InputActionPhase phase) {
            if (phase != InputActionPhase.Performed) return;

            SetPanelVisibility(!panelVisibleBinding.value);
        }


        private void OnSetPanelPositionTrigger(Vector2 position) {
            panelPositionBinding.Update(position);
        }


        /// <summary>
        /// Toggle stats panel visibility
        /// </summary>
        public void TogglePanelVisibility() {
            panelVisibleBinding.Update(!panelVisibleBinding.value);
        }


        /// <summary>
        /// Set stats panel visibility to a given value
        /// </summary>
        public void SetPanelVisibility(bool open) {
            panelVisibleBinding.Update(open);
        }


        /// <summary>
        /// Reset stats panel position (if inaccessible, etc)
        /// </summary>
        public void ResetPanelPosition() {
            panelPositionBinding.Update(Vector2.zero);
            Mod.Log.Info("Reset panel position");
        }
    }
}
