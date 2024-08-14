using Colossal;
using Colossal.IO.AssetDatabase.Internal;

using Game.Settings;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CityStats.Localization {
    /// <summary>
    /// Default localization file (English)
    ///
    /// NOTE: Uses the "default" CS2 localization dictionary to benefit from C# typings 🤷‍...
    ///
    /// All other locales are handled via bundled JSON resource files (in 'Locales/*.json'). To facility generating/updating
    ///   bundled JSON files, this locale dictionary is dumped to 'ModsData/CityStats' upon startup.
    /// </summary>
    public class LocaleEN : IDictionarySource {
        private readonly ModSettings settings;


        public LocaleEN(ModSettings settings) {
            this.settings = settings;
        }


        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts) {
            // Built-in CS2 options use the following "mod ID" format in all "Options" keys (cannot be changed!)
            //   modId = $"{type.Assembly.GetName().Name}.{type.Namespace}.{type.Name}"
            //   ex. "CityStats.CityStats.Mod"
            // List of some built-in localization keys:
            //   - GetSettingsLocaleId: $"Options.SECTION[{modId}]"
            //   - GetOptionTabLocaleID: $"Options.TAB[{modId}.{tabName}]"
            //   - GetOptionGroupLocaleID: $"Options.GROUP[{modId}.{groupName}]"
            //   - GetOptionLabelLocaleId: $"Options.OPTION[{modId}.{name}.{optionName}]"
            //   - GetOptionDescLocaleId: $"Options.OPTION_DESCRIPTION[{id}.{name}.{optionName}]"
            //   - GetEnumValueLocaleId: $"Options.{modId}.{typeof(T).Name.ToUpper()}[{value}]"
            //   - GetOptionWarningLocaleID: $"Options.WARNING[{modId}.{name}.{optionName}]"
            //   - GetBindingMapLocaleId: $"Options.INPUT_MAP[{modId}]"

            return new Dictionary<string, string>
            {
                // Settings Menu localization
                { settings.GetSettingsLocaleID(), "City Stats" },
                { settings.GetOptionTabLocaleID(ModSettings.TAB_MAIN), "Main" },
                { settings.GetOptionGroupLocaleID(ModSettings.GROUP_KEYBINDING), "Keybindings" },
                { settings.GetOptionGroupLocaleID(ModSettings.GROUP_GENERAL), "General" },
                { settings.GetOptionGroupLocaleID(ModSettings.GROUP_LOCALIZATION), "Localization" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.PanelOpenOnLoad)), "Open on load" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.PanelOpenOnLoad)), "Whether panel should open automatically when loading a save." },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.PanelOrientation)), "Panel orientation" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.PanelOrientation)), "Whether panel is oriented vertically or horizontally." },

                { settings.GetEnumValueLocaleID(StatsPanelOrientation.Horizontal), "Horizontal" },
                { settings.GetEnumValueLocaleID(StatsPanelOrientation.Vertical), "Vertical" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetPanelPosition)), "Reset panel position" },
                { settings.GetOptionWarningLocaleID(nameof(ModSettings.ResetPanelPosition)), "Are you sure you want to reset the panel position?" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetPanelPosition)), "Reset panel position (ie. if inaccessible, etc)" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetHiddenStats)), "Clear hidden stats" },
                { settings.GetOptionWarningLocaleID(nameof(ModSettings.ResetHiddenStats)), "Are you sure you want to show all stats again?" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetHiddenStats)), "Clear hidden stats and display all stats again." },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.TogglePanelBinding)), "Toggle panel" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.TogglePanelBinding)), "Hotkey to toggle panel display" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.ResetBindings)), "Reset key bindings" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.ResetBindings)), "Reset all key bindings of the mod" },

                { settings.GetOptionLabelLocaleID(nameof(ModSettings.LocalizationBetaAlert)), "Localization in Beta!" },
                { settings.GetOptionDescLocaleID(nameof(ModSettings.LocalizationBetaAlert)), "Localization for some languages may still be in a beta state; please consider contributing on CrowdIn!" },

                // Toolbar localization
                { "CityStats.ToolbarActions[TogglePanel].TooltipTitle", "City Stats" },
                { "CityStats.ToolbarActions[TogglePanel].TooltipDescription", "View important city statistics at a glance" },

                // Stats (common) localization
                { "CityStats.Stats[ElectricityAvailability]", "Electricity Availability" },
                { "CityStats.Stats[WaterAvailability]", "Water Availability" },
                { "CityStats.Stats[SewageTreatment]", "Sewage Treatment" },
                { "CityStats.Stats[GarbageProcessing]", "Garbage Processing" },
                { "CityStats.Stats[LandfillAvailability]", "Landfill Availability" },
                { "CityStats.Stats[HealthcareAvailability]", "Healthcare Availability" },
                { "CityStats.Stats[CemeteryAvailability]", "Cemetery Availability" },
                { "CityStats.Stats[CrematoryAvailability]", "Crematory Availability" },
                { "CityStats.Stats[FireHazard]", "Fire Hazard" },
                { "CityStats.Stats[CrimeRate]", "Crime Rate" },
                { "CityStats.Stats[ShelterAvailability]", "Shelter Availability" },
                { "CityStats.Stats[ElementaryAvailability]", "Elementary Availability" },
                { "CityStats.Stats[HighschoolAvailability]", "Highschool Availability" },
                { "CityStats.Stats[CollegeAvailability]", "College Availability" },
                { "CityStats.Stats[UniversityAvailability]", "University Availability" },
                { "CityStats.Stats[MailAvailability]", "Mail Availability" },
                { "CityStats.Stats[ParkingAvailability]", "Parking Availability" },
                { "CityStats.Stats[Unemployment]", "Unemployment" },

                // Panel localization
                { "CityStats.StatsPanel.Actions[ToggleStats]", "Toggle stat visibility" },
                { "CityStats.StatsPanel.StatTooltip.Modifier[Hidden]", "hidden" },
            };
        }


        public void Unload() { }
    }
}
