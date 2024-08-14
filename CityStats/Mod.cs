using CityStats.Localization;
using CityStats.Systems;
using Colossal.IO.AssetDatabase;
using Colossal.Logging;
using Game;
using Game.Input;
using Game.Modding;
using Game.SceneFlow;
using Game.Settings;
using System.IO;
using System.Linq;
using Unity.Entities;
using UnityEngine;

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

            // DEBUG: Output localization key/value dictionary to take inspiration from Vanilla keys
            // https://cs2.paradoxwikis.com/Localize_your_mod
            bool outputLocaleDictionary = false;
            if (outputLocaleDictionary) {
                var strings = GameManager.instance.localizationManager.activeDictionary.entries
                    .OrderBy(kv => kv.Key)
                    .ToDictionary(kv => kv.Key, kv => kv.Value);
                var json = Colossal.Json.JSON.Dump(strings);
                var filePath = Path.Combine(Application.persistentDataPath, "locale-dictionary.json");
                File.WriteAllText(filePath, json);
            }

            // TODO: Implement/improve localization (ideally would not require individual classes)
            GameManager.instance.localizationManager.AddSource("en-US", new LocaleEN(Settings));

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
