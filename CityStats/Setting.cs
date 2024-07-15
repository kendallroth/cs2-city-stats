using Colossal;
using Colossal.IO.AssetDatabase;
using Game.Input;
using Game.Modding;
using Game.Settings;
using Game.UI;
using Game.UI.Widgets;
using System.Collections.Generic;

namespace CityStats {
    [FileLocation(nameof(CityStats))]
    [SettingsUIGroupOrder(kKeybindingGroup)]
    [SettingsUIShowGroupName(kKeybindingGroup)]
    [SettingsUIKeyboardAction(Mod.kButtonActionName, ActionType.Button, usages: new string[] { Usages.kMenuUsage, "TestUsage" }, interactions: new string[] { "UIButton" })]
    [SettingsUIGamepadAction(Mod.kButtonActionName, ActionType.Button, usages: new string[] { Usages.kMenuUsage, "TestUsage" }, interactions: new string[] { "UIButton" })]
    [SettingsUIMouseAction(Mod.kButtonActionName, ActionType.Button, usages: new string[] { Usages.kMenuUsage, "TestUsage" }, interactions: new string[] { "UIButton" })]
    public class Setting : ModSetting {
        public const string kSection = "Main";

        public const string kKeybindingGroup = "KeyBinding";

        public Setting(IMod mod) : base(mod) {

        }

        [SettingsUIKeyboardBinding(BindingKeyboard.S, Mod.kButtonActionName, shift: true, ctrl: true)]
        [SettingsUISection(kSection, kKeybindingGroup)]
        public ProxyBinding TogglePanelBinding { get; set; }

        [SettingsUISection(kSection, kKeybindingGroup)]
        public bool ResetBindings {
            set {
                Mod.log.Info("Reset key bindings");
                ResetKeyBindings();
            }
        }

        public override void SetDefaults() {
            throw new System.NotImplementedException();
        }
    }

    public class LocaleEN : IDictionarySource {
        private readonly Setting m_Setting;
        public LocaleEN(Setting setting) {
            m_Setting = setting;
        }
        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts) {
            return new Dictionary<string, string>
            {
                { m_Setting.GetSettingsLocaleID(), "CityStats" },
                { m_Setting.GetOptionTabLocaleID(Setting.kSection), "Main" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.TogglePanelBinding)), "Toggle panel" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.TogglePanelBinding)), $"Hotkey to toggle panel display" },

                { m_Setting.GetOptionLabelLocaleID(nameof(Setting.ResetBindings)), "Reset key bindings" },
                { m_Setting.GetOptionDescLocaleID(nameof(Setting.ResetBindings)), $"Reset all key bindings of the mod" },

                // TODO: Determine if this is necessary?
                { m_Setting.GetBindingKeyLocaleID(Mod.kButtonActionName), "Button key" },

                { m_Setting.GetBindingMapLocaleID(), "Mod settings sample" },
            };
        }

        public void Unload() {

        }
    }
}
