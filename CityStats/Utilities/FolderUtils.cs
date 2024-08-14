using Colossal.PSI.Environment;
using System.IO;

namespace CityStats.Utilities {
    internal class FolderUtils {
        /// <summary>
        /// Mod data folder within CS2 data directory
        /// </summary>
        public static string DataFolder { get; }

        static FolderUtils() {
            DataFolder = Path.Combine(EnvPath.kUserDataPath, "ModsData", nameof(CityStats));

            Directory.CreateDirectory(DataFolder);
        }
    }
}
