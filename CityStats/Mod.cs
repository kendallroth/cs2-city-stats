using Colossal.IO.AssetDatabase;
using Colossal.Logging;
using Game;
using Game.Input;
using Game.Modding;
using Game.SceneFlow;
using UnityEngine;

namespace CityStats {
    public class Mod : IMod {
        public static ILog log = LogManager.GetLogger($"{nameof(CityStats)}.{nameof(Mod)}").SetShowsErrorsInUI(false);
        private Setting m_Setting;
        public static ProxyAction m_ButtonAction;

        public const string kButtonActionName = "ButtonBinding";

        public void OnLoad(UpdateSystem updateSystem) {
            log.Info(nameof(OnLoad));

            if (GameManager.instance.modManager.TryGetExecutableAsset(this, out var asset))
                log.Info($"Current mod asset at {asset.path}");

            /*m_Setting = new Setting(this);
            m_Setting.RegisterInOptionsUI();
            GameManager.instance.localizationManager.AddSource("en-US", new LocaleEN(m_Setting));

            m_Setting.RegisterKeyBindings();

            m_ButtonAction = m_Setting.GetAction(kButtonActionName);

            m_ButtonAction.shouldBeEnabled = true;

            m_ButtonAction.onInteraction += (_, phase) => log.Info($"[{m_ButtonAction.name}] On{phase} {m_ButtonAction.ReadValue<float>()}");

            AssetDatabase.global.LoadSettings(nameof(CityStats), m_Setting, new Setting(this));*/
        }

        public void OnDispose() {
            log.Info(nameof(OnDispose));
            if (m_Setting != null) {
                m_Setting.UnregisterInOptionsUI();
                m_Setting = null;
            }
        }
    }
}
