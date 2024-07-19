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
using System.Text;
using System.Threading;
using Unity.Entities;

// TODO: Decide between referencing settings actions by constant variable OR by 'nameof' (might mainly matter for localization?)

namespace CityStats {
    public enum StatsPanelOrientation {
        Horizontal,
        Vertical
    }


    /// <summary>
    /// Mod settings are global (stored at "${GamePath}/ModSettings/CityStats/CityStats.coc")
    /// </summary>
    /// <remarks>
    /// Only global, user-configurable (optional?) settings should be stored here! Save-specific data must
    ///   be serialized in an entity via ECS!
    /// </remarks>
    // TODO: Figure out how to use interpolate C# string (allegedly requires upgrade to C#10)
    [FileLocation("ModsSettings/" + Mod.NAME + "/" + Mod.NAME)]
    [SettingsUIGroupOrder(GROUP_GENERAL, GROUP_KEYBINDING)]
    [SettingsUIShowGroupName(GROUP_GENERAL, GROUP_KEYBINDING)]
    public class ModSettings : ModSetting {
        public const string SECTION_MAIN = "Main";
        public const string GROUP_GENERAL = "General";
        public const string GROUP_KEYBINDING = "KeyBinding";


        #region Lifecycle
        public ModSettings(IMod mod) : base(mod) {}
        #endregion


        #region Main / General
        /// <summary>
        /// Whether stats panel should display upon loading a save
        /// </summary>
        [SettingsUISection(SECTION_MAIN, GROUP_GENERAL)]
        public bool PanelOpenOnLoad { get; set; } = false;

        [SettingsUISection(SECTION_MAIN, GROUP_GENERAL)]
        public StatsPanelOrientation PanelOrientation { get; set; } = StatsPanelOrientation.Horizontal;

        [SettingsUISection(SECTION_MAIN, GROUP_GENERAL)]
        [SettingsUIButton]
        [SettingsUIConfirmation]
        [SettingsUIDisableByCondition(typeof(ModSettings), nameof(IsResetPositionHidden))]
        [SettingsUIHideByCondition(typeof(ModSettings), nameof(IsResetPositionHidden))]
        public bool ResetPanelPosition {
            set {
                World.DefaultGameObjectInjectionWorld.GetExistingSystemManaged<ModUISystem>().ResetPanelPosition();
            }
        }
        #endregion


        #region Main / Keybindings
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
                Mod.Log.Debug("ResetBindings click");
                ResetKeyBindings();
            }
        }

        /// <summary>
        /// Only show "Reset Position" button while in-game (not in main menu)
        /// </summary>
        public bool IsResetPositionHidden() {
            return Mod.InGameMode;
        }
        #endregion


        #region Methods
        /// <summary>
        /// Reset settings to defaults
        /// </summary>
        public override void SetDefaults() {
            ResetKeyBindings();
        }


        public new string ToString() {
            return $"PanelOrientation={PanelOrientation};PanelOpenOnLoad={PanelOpenOnLoad}";
        }
        #endregion
    }
}
