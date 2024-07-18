using CityStats.Systems;
using Colossal;
using Colossal.IO.AssetDatabase;
using Game.Input;
using Game.Modding;
using Game.SceneFlow;
using Game.Settings;
using Game.UI;
using Game.UI.Widgets;
using System.Collections.Generic;
using Unity.Entities;

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
    [SettingsUIGroupOrder(GROUP_GENERAL, GROUP_KEYBINDING)]
    [SettingsUIShowGroupName(GROUP_GENERAL, GROUP_KEYBINDING)]
    public class CityStatsSettings : ModSetting {
        public const string SECTION_MAIN = "Main";
        public const string GROUP_GENERAL = "General";
        public const string GROUP_KEYBINDING = "KeyBinding";

        public CityStatsSettings(IMod mod) : base(mod) {
            // NOTE: Likely can remain empty
        }

        [SettingsUISection(SECTION_MAIN, GROUP_GENERAL)]
        [SettingsUIButton]
        [SettingsUIConfirmation]
        [SettingsUIDisableByCondition(typeof(CityStatsSettings), nameof(IsResetPositionHidden))]
        [SettingsUIHideByCondition(typeof(CityStatsSettings), nameof(IsResetPositionHidden))]
        public bool ResetPanelPosition {
            set {
                Mod.Log.Debug("ResetPanelPosition clicked");
                World.DefaultGameObjectInjectionWorld.GetExistingSystemManaged<CityStatsUISystem>().ResetPanelPosition();
            }
        }

        /// <summary>
        /// Key binding to toggle panel visibility
        /// </summary>
        [SettingsUISection(SECTION_MAIN, GROUP_KEYBINDING)]
        [SettingsUIKeyboardBinding(BindingKeyboard.S, nameof(TogglePanelBinding), ctrl: true, shift: true)]
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

        /// <summary>
        /// Only show "Reset Position" button while in-game (not in main menu)
        /// </summary>
        public bool IsResetPositionHidden() {
            return (GameManager.instance.gameMode & Game.GameMode.Game) == 0;
        }


        public override void SetDefaults() {
            throw new System.NotImplementedException();
        }
    }
}
