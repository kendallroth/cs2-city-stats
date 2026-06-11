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
using Unity.Mathematics;
using UnityEngine;
using UnityEngine.InputSystem;

namespace CityStats.Systems {
    /// <summary>
    /// Whether to skip/update global settings when related values are changed
    /// </summary>
    enum GlobalSettingsUpdate {
        /// <summary>
        /// Skip updates to global settings (ie. to avoid infinite loop)
        /// </summary>
        SKIP,
        /// <summary>
        /// Update global settings
        /// </summary>
        UPDATE
    }


    internal partial class ModUISystem : UISystemBase, IDefaultSerializable, ISerializable {
        private const string defaultHiddenStats = "";
        private const int SAVE_VERSION = 0;

        private ProxyAction togglePanelBindingAction;

        // TODO: Once multiple save formats exist, consider tracking all formats in constants
        // Source: https://github.com/krzychu124/Traffic/blob/main/Code/Systems/DataMigration/TrafficDataMigrationSystem.cs

        /// <summary>
        /// Loaded save version format
        /// </summary>
        private int loadedSaveVersion = 0;
        /// <summary>
        /// Current/target save version format
        /// </summary>
        private const int targetSaveVersion = 0;

        /// <summary>
        /// Hidden stat icons (as comma-separated string)
        /// </summary>
        /// <remarks>
        /// Serialized and deserialized automatically within game save
        /// </remarks>
        private ValueBinding<string> hiddenStatsBinding;
        private ValueBinding<bool> modButtonVisibleBinding;
        private ValueBinding<float2> panelPositionBinding;
        private ValueBinding<bool> panelVisibleBinding;
        private ValueBinding<bool> panelShowDividersBinding;
        private ValueBinding<StatsPanelOrientation> panelOrientationBinding;


        #region Lifecycle
        // Called when CS2 loads (not when save is loaded!)
        protected override void OnCreate() {
            base.OnCreate();

            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnCreate");

            // Mod options bindings
            togglePanelBindingAction = Mod.Settings.GetAction(nameof(ModSettings.TogglePanelBinding));
            togglePanelBindingAction.shouldBeEnabled = true;
            togglePanelBindingAction.onInteraction += OnTogglePanelAction;
            // Action Phases: Performed, Started, Cancelled, Waiting, Disabled

            // Value bindings
            // NOTE: Value bindings tied to save files have default values applied here and should be initialized in 'OnGameLoaded'!
            //         Currently save-based values are initialized during deserialization, but apparently this is not a good practice?
            //         Value bindings tied to global settings can be initialized either here or in 'OnGameLoaded' as well.
            hiddenStatsBinding = new ValueBinding<string>(Mod.NAME, UIBindingData.VALUE_HIDDEN_STATS, defaultHiddenStats);
            AddBinding(hiddenStatsBinding);
            modButtonVisibleBinding = new ValueBinding<bool>(Mod.NAME, UIBindingData.VALUE_MOD_BUTTON_VISIBLE, Mod.Settings.ModButtonVisible);
            AddBinding(modButtonVisibleBinding);
            panelVisibleBinding = new ValueBinding<bool>(Mod.NAME, UIBindingData.VALUE_PANEL_VISIBLE, false);
            AddBinding(panelVisibleBinding);
            panelPositionBinding = new ValueBinding<float2>(Mod.NAME, UIBindingData.VALUE_PANEL_POSITION, Mod.Settings.PanelPosition);
            AddBinding(panelPositionBinding);
            panelShowDividersBinding = new ValueBinding<bool>(
                Mod.NAME,
                UIBindingData.VALUE_PANEL_SHOW_SECTION_DIVIDERS,
                Mod.Settings.PanelShowSectionDividers
            );
            AddBinding(panelShowDividersBinding);
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
            var setHiddenStatsTrigger = new TriggerBinding<string>(Mod.NAME, UIBindingData.TRIGGER_SET_HIDDEN_STATS, SetHiddenStats);
            AddBinding(setHiddenStatsTrigger);
            var setPanelVisibleTrigger = new TriggerBinding<bool>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_VISIBLE, SetPanelVisibility);
            AddBinding(setPanelVisibleTrigger);
            var setPanelPositionTrigger = new TriggerBinding<float2>(Mod.NAME, UIBindingData.TRIGGER_SET_PANEL_POSITION, (float2 position) => {
                SetPanelPosition(position, GlobalSettingsUpdate.UPDATE);
            });
            AddBinding(setPanelPositionTrigger);

            Mod.Settings.onSettingsApplied += OnModSettingsApplied;
        }


        // Called when game load begins
        protected override void OnGamePreload(Purpose purpose, GameMode mode) {
            base.OnGamePreload(purpose, mode);

            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnGamePreload");
        }


        // Called when game load completes
        protected override void OnGameLoaded(Context serializationContext) {
            base.OnGameLoaded(serializationContext);

            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnGameLoaded");

            // Ensure panel visibility is applied each save load (not just game startup)
            SetPanelVisibility(Mod.Settings.PanelOpenOnLoad);
        }


        protected override void OnDestroy() {
            base.OnDestroy();

            Mod.Log.Debug($"[{nameof(ModUISystem)}] OnDestroy");

            // Must safely check mod settings in case they are already destroyed (causes "crash" warning otherwise)
            if (Mod.Settings != null) {
                Mod.Settings.onSettingsApplied -= OnModSettingsApplied;
            }

            togglePanelBindingAction.onInteraction -= OnTogglePanelAction;
        }
        #endregion


        #region Methods
        /// <summary>
        /// Handle mod setting changes (applied immediately upon change, not when closing menu)
        /// </summary>
        private void OnModSettingsApplied(Setting baseSettings) {
            ModSettings settings = baseSettings as ModSettings;
            if (settings == null) return;

            Mod.Log.Debug($"[{nameof(ModUISystem)}] Mod settings applied");

            SetModButtonVisibility(settings.ModButtonVisible);
            SetPanelOrientation(settings.PanelOrientation);
            SetPanelSectionDividerVisibility(settings.PanelShowSectionDividers);
            // Skip updating global settings (when reacting to global changes) to avoid infinite loop!
            SetPanelPosition(settings.PanelPosition, GlobalSettingsUpdate.SKIP);
        }


        private void OnTogglePanelAction(ProxyAction action, InputActionPhase phase) {
            if (phase != InputActionPhase.Performed) return;

            TogglePanelVisibility();
        }


        /// <summary>
        /// Update whether mod button is visible
        /// </summary>
        public void SetModButtonVisibility(bool visible) {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] Setting mod button visibility");

            modButtonVisibleBinding.Update(visible);
        }


        /// <summary>
        /// Update stats panel position (local binding, global setting*)
        /// </summary>
        private void SetPanelPosition(float2 position, GlobalSettingsUpdate globalUpdate) {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] Setting mod panel position");

            panelPositionBinding.Update(position);

            if (globalUpdate != GlobalSettingsUpdate.SKIP) {
                Mod.Settings.PanelPosition = position;
            }
        }


        /// <summary>
        /// Update stats panel orientation
        /// </summary>
        /// <remarks>
        /// Will also reset panel position whenever orientation changes.
        /// </remarks>
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
        /// Update stats panel section divider visibility
        /// </summary>
        public void SetPanelSectionDividerVisibility(bool visible) {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] Setting panel section divider visibility");

            panelShowDividersBinding.Update(visible);
        }


        /// <summary>
        /// Toggle stats panel visibility
        /// </summary>
        public void TogglePanelVisibility() {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] Toggling panel visibility");

            panelVisibleBinding.Update(!panelVisibleBinding.value);
        }

        /// <summary>
        /// Update which stats are hidden
        /// </summary>
        /// <param name="stats">Comma-separated string of hidden stats</param>
        /// <remarks>
        /// Uses a comma-separated string to simplify future serialization within save game (via ECS Entity)
        /// </remarks>
        public void SetHiddenStats(string stats) {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] Updating hidden stats ({stats})");
            hiddenStatsBinding.Update(stats);
        }


        /// <summary>
        /// Set stats panel visibility to a given value
        /// </summary>
        public void SetPanelVisibility(bool open) {
            panelVisibleBinding.Update(open);
        }


        /// <summary>
        /// Reset hidden stats (to display all)
        /// </summary>
        public void ResetHiddenStats() {
            hiddenStatsBinding.Update(defaultHiddenStats);
            Mod.Log.Info($"[{nameof(ModUISystem)}] Reset hidden stats");
        }


        /// <summary>
        /// Reset stats panel position (if inaccessible, etc)
        /// </summary>
        public void ResetPanelPosition() {
            SetPanelPosition(float2.zero, GlobalSettingsUpdate.UPDATE);
            Mod.Log.Info($"[{nameof(ModUISystem)}] Reset panel position");
        }
        #endregion


        #region Serialization
        /// <summary>
        /// Set default values (only when not previously saved)
        /// </summary>
        public void SetDefaults(Context context) {
            Mod.Log.Debug($"[{nameof(ModUISystem)}] SetDefaults");

            loadedSaveVersion = 0;
            hiddenStatsBinding.Update(defaultHiddenStats);
        }

        /// <summary>
        /// Store system data within save game
        /// </summary>
        /// <remarks>
        /// NOTE: Save order must remain consistent for compatibility, and be mirrored when reading! If save data
        ///         changes in a non-compatible way (ie. reordering/replacing existing value types), the save
        ///         version must be updated and the migration handled!
        /// </remarks>
        public void Serialize<TWriter>(TWriter writer) where TWriter : IWriter {
            // CAUTION: Ensure that any changes to serialization order/type are handled appropriately, including adding
            //            a save version format upgrade if necessary!

            Mod.Log.Debug($"[{nameof(ModUISystem)}] Serializing (v{targetSaveVersion}) (hiddenStats={hiddenStatsBinding.value})");

            writer.Write(targetSaveVersion);

            writer.Write(hiddenStatsBinding.value);

            Mod.Log.Debug($"[{nameof(ModUISystem)}] Serialized");
        }

        /// <summary>
        /// Read system data from save game
        /// </summary>
        /// <remarks>
        /// NOTE: Save order must remain consistent for compatibility, and be mirrored when storing! If save data
        ///         changes in a non-compatible way (ie. reordering/replacing existing value types), the save
        ///         version must be updated and the migration handled!
        /// </remarks>
        public void Deserialize<TReader>(TReader reader) where TReader : IReader {
            // CAUTION: Ensure that any changes to deserialization order/type are handled appropriately, including adding
            //            a save version format upgrade if necessary!

            Mod.Log.Debug($"[{nameof(ModUISystem)}] Deserializing");

            reader.Read(out loadedSaveVersion);

            string savedHiddenStats;
            reader.Read(out savedHiddenStats);
            hiddenStatsBinding.Update(savedHiddenStats);

            Mod.Log.Debug($"[{nameof(ModUISystem)}] Deserialized (v{loadedSaveVersion}) (hiddenStats={savedHiddenStats})");
        }
        #endregion
    }
}
