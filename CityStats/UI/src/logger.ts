import { MOD_NAME } from "constants";

export const logger = {
  // biome-ignore lint/suspicious/noExplicitAny: Acceptable
  error: (...args: any[]) => {
    console.error(MOD_NAME, ...args);
  },
  // biome-ignore lint/suspicious/noExplicitAny: Acceptable
  log: (...args: any[]) => {
    console.log(MOD_NAME, ...args);
  },
};
