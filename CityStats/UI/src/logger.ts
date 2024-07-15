export const LOG_NAME = "CityStats";

export const logger = {
  // biome-ignore lint/suspicious/noExplicitAny: Acceptable
  error: (...args: any[]) => {
    console.error(LOG_NAME, ...args);
  },
  // biome-ignore lint/suspicious/noExplicitAny: Acceptable
  log: (...args: any[]) => {
    console.log(LOG_NAME, ...args);
  },
};
