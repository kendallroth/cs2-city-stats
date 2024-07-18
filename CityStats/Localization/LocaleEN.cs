﻿using Colossal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CityStats.Localization {
    public class LocaleEN : IDictionarySource {
        private readonly CityStatsSettings settings;

        public LocaleEN(CityStatsSettings settings) {
            this.settings = settings;
        }

        public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts) {
            return new Dictionary<string, string>
            {
                { settings.GetSettingsLocaleID(), "City Stats" },
                { settings.GetOptionTabLocaleID(CityStatsSettings.SECTION_MAIN), "Main" },
                { settings.GetOptionTabLocaleID(CityStatsSettings.GROUP_KEYBINDING), "Keybindings" },

                { settings.GetOptionLabelLocaleID(nameof(CityStatsSettings.TogglePanelBinding)), "Toggle panel" },
                { settings.GetOptionDescLocaleID(nameof(CityStatsSettings.TogglePanelBinding)), $"Hotkey to toggle panel display" },

                { settings.GetOptionLabelLocaleID(nameof(CityStatsSettings.ResetBindings)), "Reset key bindings" },
                { settings.GetOptionDescLocaleID(nameof(CityStatsSettings.ResetBindings)), $"Reset all key bindings of the mod" },

                { settings.GetBindingMapLocaleID(), "Mod settings sample" },
            };
        }

        public void Unload() {

        }
    }
}