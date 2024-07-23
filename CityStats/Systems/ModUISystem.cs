using CityStats.Data;
using Colossal.Json;
using Colossal.Serialization.Entities;
using Colossal.UI.Binding;
using Game;
using Game.Input;
using Game.Settings;
using Game.UI;
using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;

namespace CityStats.Systems {
    internal partial class ModUISystem : UISystemBase {
        private ProxyAction togglePanelBindingAction;

        private ValueBinding<Vector2> panelPositionBinding;
        private ValueBinding<bool> panelVisibleBinding;
        // TODO: See if this can be changed to a 'GetterValueBinding' (previously crashed with writing failure!)
        private ValueBinding<StatsPanelOrientation> panelOrientationBinding;


        #region Lifecycle
        protected override void OnCreate() {
            base.OnCreate();

            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnCreate");

            // Mod options bindings
            togglePanelBindingAction = Mod.Settings.GetAction(nameof(ModSettings.TogglePanelBinding));
            togglePanelBindingAction.shouldBeEnabled = true;
            togglePanelBindingAction.onInteraction += OnTogglePanelAction;
            // Action Phases: Performed, Started, Cancelled, Waiting, Disabled

            // Value bindings
            panelVisibleBinding = new ValueBinding<bool>(Mod.NAME, UIBindingData.VALUE_PANEL_VISIBLE, false);
            AddBinding(panelVisibleBinding);
            panelPositionBinding = new ValueBinding<Vector2>(Mod.NAME, UIBindingData.VALUE_PANEL_POSITION, Vector2.zero);
            AddBinding(panelPositionBinding);
            // NOTE: Could also use 'AddUpdateBinding(new GetterValueBinding(...))', except that panel position is also reset on orientation change
            panelOrientationBinding = new ValueBinding<StatsPanelOrientation>(
                Mod.NAME,
                UIBindingData.VALUE_PANEL_ORIENTATION,
                Mod.Settings.PanelOrientation,
                new EnumNameWriter<StatsPanelOrientation>()
            );
            AddBinding(panelOrientationBinding);

            // Trigger bindings
            var togglePanelVisibleTrigger = new TriggerBinding(Mod.NAME, UIBindingData.TRIGGER_TOGGLE_PANEL_VISIBLE, TogglePanelVisibility);
            AddBinding(togglePanelVisibleTrigger);
            var setPanelVisibleTrigger = new TriggerBinding<bool>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_VISIBLE, SetPanelVisibility);
            AddBinding(setPanelVisibleTrigger);
            var setPanelPositionTrigger = new TriggerBinding<Vector2>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_POSITION, OnSetPanelPositionTrigger);
            AddBinding(setPanelPositionTrigger);

            Mod.Settings.onSettingsApplied += OnModSettingsApplied;
        }


        protected override void OnGamePreload(Purpose purpose, GameMode mode) {
            base.OnGamePreload(purpose, mode);
            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnGamePreload");
        }


        protected override void OnGameLoaded(Context serializationContext) {
            base.OnGameLoaded(serializationContext);
            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnGameLoaded");

            SetPanelVisibility(Mod.Settings.PanelOpenOnLoad);
        }


        protected override void OnDestroy() {
            base.OnDestroy();

            Mod.Settings.onSettingsApplied -= OnModSettingsApplied;
            togglePanelBindingAction.onInteraction -= OnTogglePanelAction;
        }
        #endregion


        /// <summary>
        /// Handle mod setting changes (applied immediately upon change, not when closing menu)
        /// </summary>
        private void OnModSettingsApplied(Setting baseSettings) {
            ModSettings settings = baseSettings as ModSettings;
            if (settings == null) return;

            SetPanelOrientation(settings.PanelOrientation);
        }


        private void OnTogglePanelAction(ProxyAction action, InputActionPhase phase) {
            if (phase != InputActionPhase.Performed) return;

            TogglePanelVisibility();
        }


        private void OnSetPanelPositionTrigger(Vector2 position) {
            panelPositionBinding.Update(position);
        }


        /// <summary>
        /// Update stats panel orientation
        /// </summary>
        public void SetPanelOrientation(StatsPanelOrientation orientation) {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] Setting panel orientation");

            var oldOrientation = panelOrientationBinding.value;
            // Reset panel position (only) whenever panel orientation changes
            if (oldOrientation != orientation) {
                ResetPanelPosition();
            }
            panelOrientationBinding.Update(orientation);
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
            Mod.Log.Info($"[{nameof(ModUISystem)}] Reset panel position");
        }
    }
}
