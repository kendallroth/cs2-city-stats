using CityStats.Localization;
using Colossal.PSI.Environment;
using CityStats.Systems;
using Colossal;
using Colossal.IO.AssetDatabase;
using Colossal.Json;
using Colossal.Logging;
using Game;
using Game.Input;
using Game.Modding;
using Game.SceneFlow;
using Game.Settings;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Unity.Entities;
using UnityEngine;
using CityStats.Utilities;

namespace CityStats {
    public class Mod : IMod {
        public const string NAME = "CityStats";

        /// <summary>
        /// Mod logger
        /// </summary>
        public static ILog Log { get; } = LogManager.GetLogger(NAME).SetShowsErrorsInUI(false);

        /// <summary>
        /// Mod settings (persisted)
        /// </summary>
        public static ModSettings Settings { get; private set; }

        /// <summary>
        /// Whether game is running in "game" mode (vs menu, editor, etc)
        /// </summary>
        public static bool InGameMode() {
            // NOTE: Must be a function (not a getter) to properly execute immediately upon load (vs after first reference)
            return GameManager.instance.gameMode == GameMode.Game;
        }


        #region Lifecycle
        public void OnLoad(UpdateSystem updateSystem) {
            Log.Info($"[{nameof(Mod)}] OnLoad");

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset)) {
                Log.Info($"Current mod asset at '{asset.path}'");
            }

            // Initialize/register settings and load persisted values
            Settings = new ModSettings(this);
            Settings.RegisterInOptionsUI();
            Settings.RegisterKeyBindings();

            AssetDatabase.global.LoadSettings(NAME, Settings, new ModSettings(this));
            Settings.onSettingsApplied += OnModSettingsApplied;

            Log.Info($"[{nameof(Mod)}] SettingsLoaded: {Settings.ToString()}");

            // DEBUG: Dump vanilla localization key/value dictionary to take inspiration from Vanilla keys
            // https://cs2.paradoxwikis.com/Localize_your_mod
            bool dumpVanillaLocaleDictionary = false;
            if (dumpVanillaLocaleDictionary) {
                var strings = GameManager.instance.localizationManager.activeDictionary.entries
                    .OrderBy(kv => kv.Key)
                    .ToDictionary(kv => kv.Key, kv => kv.Value);
                string json = JSON.Dump(strings);
                string filePath = Path.Combine(Application.persistentDataPath, "vanilla-locale-dictionary.json");
                File.WriteAllText(filePath, json);
            }

            var localeEn = new LocaleEN(Settings);
            GameManager.instance.localizationManager.AddSource("en-US", localeEn);

            // DEBUG: Dump mod localization key/value dictionary to 'ModsData' (for creating other localizations)
            LocaleLoader.DumpDictionary(localeEn, "en-US.locale.json");

            // Load other JSON localization files (from "Locales/*.json")
            foreach (var item in new LocaleLoader("Locales").GetAvailableLocales()) {
                Log.Info($"[{nameof(Mod)}] Loaded localization ({item.LocaleKey})");

                GameManager.instance.localizationManager.AddSource(item.LocaleKey, item);
            }

            // Register mod systems with ECS (with appropriate update phases)
            updateSystem.UpdateAt<ModUISystem>(SystemUpdatePhase.UIUpdate);
        }


        public void OnDispose() {
            Log.Info($"[{nameof(Mod)}] Mod disposed");

            if (Settings != null) {
                Settings.onSettingsApplied -= OnModSettingsApplied;
                Settings.UnregisterInOptionsUI();
                Settings = null;
            }
        }
        #endregion


        private void OnModSettingsApplied(Setting baseSettings) {
            ModSettings settings = baseSettings as ModSettings;
            if (settings == null) return;

            Log.Debug($"[{nameof(Mod)}] Settings applied: {settings.ToString()}");
        }
    }
}
