using Colossal;
using Game.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CityStats.Localization {
    public class LocaleEN : IDictionarySource {
        private readonly ModSettings settings;

        public LocaleEN(ModSettings settings) {
            this.settings = settings;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts) {
            return new Dictionary<string, string>
            {
                // Settings Menu
                { settings.GetSettingsLocaleID(), "City Stats" },
                { settings.GetOptionTabLocaleID(ModSettings.SECTION_MAIN), "Main" },
                { settings.GetOptionGroupLocaleID(ModSettings.GROUP_KEYBINDING), "Keybindings" },
                { settings.GetOptionGroupLocaleID(ModSettings.GROUP_GENERAL), "General" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.PanelOpenOnLoad)), "Open on load" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.PanelOpenOnLoad)), "Whether panel should open automatically when loading a save." },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.PanelOrientation)), "Panel orientation" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.PanelOrientation)), "Whether panel is oriented vertically or horizontally." },

                { settings.GetEnumValueLocaleID(StatsPanelOrientation.Horizontal), "Horizontal" },
                { settings.GetEnumValueLocaleID(StatsPanelOrientation.Vertical), "Vertical" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetPanelPosition)), "Reset panel position" },
                { settings.GetOptionWarningLocaleID(nameof(ModSettings.ResetPanelPosition)), "Are you sure you want to reset the panel position?" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetPanelPosition)), $"Reset panel position (ie. if inaccessible, etc)" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetHiddenStats)), "Reset hidden stats" },
                { settings.GetOptionWarningLocaleID(nameof(ModSettings.ResetHiddenStats)), "Are you sure you want to reset the panel position?" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetHiddenStats)), $"Reset hidden stats and display all stats again." },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.TogglePanelBinding)), "Toggle panel" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.TogglePanelBinding)), $"Hotkey to toggle panel display" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetBindings)), "Reset key bindings" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetBindings)), $"Reset all key bindings of the mod" },

                { settings.GetBindingMapLocaleID(), "Mod settings sample" },
            };
        }

        public void Unload() {

        }
    }
}
