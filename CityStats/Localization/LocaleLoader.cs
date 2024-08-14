using CityStats.Utilities;
using Colossal;
using Colossal.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CityStats.Localization {
    /// <summary>
    /// Load in-mod localization JSON files
    ///
    /// Inspiration: https://github.com/JadHajjar/FindIt-CSII/blob/main/FindIt/Domain/Utilities/LocaleHelper.cs
    /// </summary>
    internal class LocaleLoader {
        private readonly Dictionary<string, Dictionary<string, string>> locales;

        /// <summary>
        /// Load in-mod localization JSON files
        /// </summary>
        /// <param name="localeFileFilter">Filter for locale files (to ignore other resources files)</param>
        public LocaleLoader(string localeFileFilter) {
            var assembly = GetType().Assembly;

            locales = new Dictionary<string, Dictionary<string, string>> { };

            Mod.Log.Info($"[{nameof(LocaleLoader)}] Loading locales");

            foreach (string resourceName in assembly.GetManifestResourceNames()) {
                // Ignore any bundles resources not containing the locale file path filter
                if (!resourceName.Contains(localeFileFilter)) {
                    continue;
                }

                string fileName = Path.GetFileNameWithoutExtension(resourceName);
                string localeKey = fileName.Substring(fileName.LastIndexOf(".") + 1);

                Mod.Log.Debug($"[{nameof(LocaleLoader)}] LocaleLoader resource: '{resourceName}', fileName: '{fileName}', localeKey: '{localeKey}'");

                try {
                    locales.Add(localeKey, GetLocaleDictionary(resourceName));
                } catch (Exception e) {
                    Mod.Log.Error($"[{nameof(LocaleLoader)}] Failed to load locale from resource ({resourceName}) with error '{e.Message}'");
                }
            }
        }


        /// <summary>
        /// Dump mod localization key/value dictionary to 'ModsData' folder (for debugging)
        /// </summary>
        /// <param name="dictionarySource">CS2 dictionary source</param>
        /// <param name="outputFile">Output file name</param>
        public static void DumpDictionary(IDictionarySource dictionarySource, string outputFile) {
            try {
                var entries = dictionarySource.ReadEntries(null, new Dictionary<string, int>());
                var dictionary = entries.ToDictionary(i => i.Key, i => i.Value);

                string filePath = Path.Combine(FolderUtils.DataFolder, outputFile);
                File.WriteAllText(filePath, dictionary.ToJSONString(EncodeOptions.IgnoreSetters));
                Mod.Log.Debug($"[{nameof(Mod)}] Dumped mod locale ({filePath})");
            } catch {
                Mod.Log.Warn($"[{nameof(Mod)}] Failed to dump mod locale to output ({outputFile})");
            }
        }


        /// <summary>
        /// Get localization dictionary from JSON file (by locale key)
        /// </summary>
        /// <param name="localeKey">Locale file name</param>
        private Dictionary<string, string> GetLocaleDictionary(string localeKey) {
            var assembly = GetType().Assembly;

            using var resourceStream = assembly.GetManifestResourceStream(localeKey);
            if (resourceStream == null) {
                return new Dictionary<string, string>();
            }

            using var reader = new StreamReader(resourceStream, Encoding.UTF8);
            JSON.MakeInto<Dictionary<string, string>>(JSON.Load(reader.ReadToEnd()), out var dictionary);

            return dictionary;
        }


        /// <summary>
        /// Get all available in-mod locales
        /// </summary>
        public IEnumerable<LocaleDictionarySource> GetAvailableLocales() {
            foreach (var locale in locales) {
                yield return new LocaleDictionarySource(locale.Key, locale.Value);
            }
        }


        /// <summary>
        /// In-mod localization dictionary source (for CO localization)
        /// </summary>
        public class LocaleDictionarySource : IDictionarySource {
            private readonly Dictionary<string, string> dictionary;

            public string LocaleKey { get; }

            public LocaleDictionarySource(string localeKey, Dictionary<string, string> dictionary) {
                LocaleKey = localeKey;
                this.dictionary = dictionary;
            }

            public IEnumerable<KeyValuePair<string, string>> ReadEntries(IList<IDictionaryEntryError> errors, Dictionary<string, int> indexCounts) {
                return dictionary;
            }

            public void Unload() { }
        }
    }
}
