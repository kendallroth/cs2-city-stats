using Colossal;
using Colossal.IO.AssetDatabase.Internal;

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

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetHiddenStats)), "Clear hidden stats" },
                { settings.GetOptionWarningLocaleID(nameof(ModSettings.ResetHiddenStats)), "Are you sure you want to show all stats again?" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetHiddenStats)), $"Clear hidden stats and display all stats again." },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.TogglePanelBinding)), "Toggle panel" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.TogglePanelBinding)), $"Hotkey to toggle panel display" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetBindings)), "Reset key bindings" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetBindings)), $"Reset all key bindings of the mod" },

                { settings.GetBindingMapLocaleID(), "Mod settings sample" },
                { "CS2-City-Stats.Electricity Availability", "Electricity Availability" },
                { "CS2-City-Stats.Water Availability", "Water Availability" },
                { "CS2-City-Stats.Sewage Treatment", "Sewage Treatment" },
                { "CS2-City-Stats.Garbage Processing", "Garbage Processing" },
                { "CS2-City-Stats.Landfill Availability", "Landfill Availability" },
                { "CS2-City-Stats.Healthcare Availability", "Healthcare Availability" },
                { "CS2-City-Stats.Cemetery Availability", "Cemetery Availability" },
                { "CS2-City-Stats.Crematory Availability", "Crematory Availability" },
                { "CS2-City-Stats.Fire Hazard", "Fire Hazard" },
                { "CS2-City-Stats.Crime Rate", "Crime Rate" },
                { "CS2-City-Stats.Shelter Availability", "Shelter Availability" },
                { "CS2-City-Stats.Elementary Availability", "Elementary Availability" },
                { "CS2-City-Stats.Highschool Availability", "Highschool Availability" },
                { "CS2-City-Stats.College Availability", "College Availability" },
                { "CS2-City-Stats.University Availability", "University Availability" },
                { "CS2-City-Stats.Mail Availability", "Mail Availability" },
                { "CS2-City-Stats.Parking Availability", "Parking Availability" },
                { "CS2-City-Stats.Unemployment", "Unemployment" },
                { "CS2-City-Stats.Toogle Stats", "Toggle stat visibility" },
                { "CS2-City-Stats.City Stats", "City Stats" },
                { "CS2-City-Stats.City Stats.desc", "View important city statistics at a glance" }
            };
        }

        public void Unload() {

        }
    }
}
