using CityStats.Localization;
using CityStats.Systems;
using Colossal.IO.AssetDatabase;
using Colossal.Logging;
using Game;
using Game.Input;
using Game.Modding;
using Game.SceneFlow;
using Unity.Entities;
using UnityEngine;

namespace CityStats {
    public class Mod : IMod {
        public const string NAME = "CityStats";

        /// <summary>
        /// Mod logger
        /// </summary>
        public static ILog Log { get; } = LogManager.GetLogger(Mod.NAME).SetShowsErrorsInUI(false);

        /// <summary>
        /// Mod settings (persisted)
        /// </summary>
        public static CityStatsSettings Settings { get; private set; }

        public void OnLoad(UpdateSystem updateSystem) {
            Log.Info($"Mod loaded: {nameof(OnLoad)}");

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset)) {
                Log.Info($"Current mod asset at {asset.path}");
            }

            // Initialize/register settings and load persisted values
            Settings = new CityStatsSettings(this);
            Settings.RegisterInOptionsUI();
            Settings.RegisterKeyBindings();
            AssetDatabase.global.LoadSettings(Mod.NAME, Settings, new CityStatsSettings(this));

            // TODO: Implement/improve localization (ideally would not require individual classes)
            GameManager.instance.localizationManager.AddSource("en-US", new LocaleEN(Settings));

            // Register mod systems with ECS
            updateSystem.UpdateAt<CityStatsUISystem>(SystemUpdatePhase.UIUpdate);
        }

        public void OnDispose() {
            Log.Info(nameof(OnDispose));

            if (Settings != null) {
                Settings.UnregisterInOptionsUI();
                Settings = null;
            }
        }
    }
}
