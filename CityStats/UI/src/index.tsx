import type { ModRegistrar } from "cs2/modding";

import { logger } from "logger";
import StatsMod from "mod/ui";

const register: ModRegistrar = (moduleRegistry) => {
  logger.log("Registering mod");

  console.log(moduleRegistry.registry.entries());
  // @ts-expect-error
  window.csiiRegistry = moduleRegistry.registry;

  moduleRegistry.append("GameTopLeft", () => <StatsMod />);
};

export default register;
