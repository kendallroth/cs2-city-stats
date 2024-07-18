import type { ModRegistrar } from "cs2/modding";

import { logger } from "logger";
import StatsMenuButton from "mods/stats-menu-button/stats-menu-button";
import StatsPanel from "mods/stats-panel/stats-panel";

const register: ModRegistrar = (moduleRegistry) => {
  logger.log("Registering mod");

  // @ts-expect-error Assign the module registry to 'window' for easy access
  window.csiiRegistry = moduleRegistry.registry;

  // NOTE: Mods are remounted at several times, but not always unmounted, which must be considered
  //         if using non-C# state or establishing other connections!
  //       Remount times: returning from pause menu
  moduleRegistry.append("GameTopLeft", () => <StatsMenuButton />);
  moduleRegistry.append("Game", () => <StatsPanel />);
};

export default register;
