using Colossal;
using Colossal.IO.AssetDatabase;
using Game.Input;
using Game.Modding;
using Game.Settings;
using Game.UI;
using Game.UI.Widgets;
using System.Collections.Generic;

// TODO: Decide between referencing settings actions by constant variable OR by 'nameof' (might mainly matter for localization?)

namespace CityStats {
    /// <summary>
    /// Mod settings are global (stored at "${GamePath}/ModSettings/CityStats/CityStats.coc")
    /// </summary>
    /// <remarks>
    /// Only global, user-configurable (optional?) settings should be stored here! Save-specific data must
    ///   be serialized in an entity via ECS!
    /// </remarks>
    // TODO: Figure out how to use interpolate C# string (allegedly requires upgrade to C#10)
    [FileLocation("ModSettings/" + Mod.NAME + "/" + Mod.NAME)]
    [SettingsUIGroupOrder(GROUP_KEYBINDING)]
    [SettingsUIShowGroupName(GROUP_KEYBINDING)]
    public class CityStatsSettings : ModSetting {
        public const string SECTION_MAIN = "Main";
        public const string GROUP_KEYBINDING = "KeyBinding";

        public CityStatsSettings(IMod mod) : base(mod) {
            // NOTE: Likely can remain empty
        }

        /// <summary>
        /// Key binding to toggle panel visibility
        /// </summary>
        [SettingsUIKeyboardBinding(BindingKeyboard.S, nameof(TogglePanelBinding), ctrl: true, shift: true)]
        [SettingsUISection(SECTION_MAIN, GROUP_KEYBINDING)]
        public ProxyBinding TogglePanelBinding { get; set; }

        /// <summary>
        /// Reset all key bindings to defaults
        /// </summary>
        [SettingsUISection(SECTION_MAIN, GROUP_KEYBINDING)]
        public bool ResetBindings {
            set {
                Mod.Log.Info("Reset key bindings");
                ResetKeyBindings();
            }
        }

        public override void SetDefaults() {
            throw new System.NotImplementedException();
        }
    }
}
