/** Convert a percent (float) to a hex value (ie. for opacity) */
export const getHexOpacity = (percent: number) => {
  return Math.round(255 * percent).toString(16);
};
