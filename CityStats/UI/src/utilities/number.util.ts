import type { IndicatorValue } from "cs2/bindings";

export const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export const clampPercent = (value: number) => {
  return Math.min(Math.max(value, 0), 1);
};

/**
 * Get a value from a percentage within a range
 *
 * @param percentFormat - Whether input percent was an int (`0-100`) or float (`0-1`)
 */
export const getValueFromPercent = (
  percent: number,
  min: number,
  max: number,
  percentFormat: "float" | "int" = "float",
): number => {
  const multiplier = percentFormat === "float" ? 1 : 100;
  return ((max - min) / multiplier) * percent + min;
};

/**
 * Get a percent based on a value's position within a range
 *
 * @param percentFormat - Whether output percent should be an int (`0-100`) or a float (`0-1`)
 */
export const getPercentFromValue = (
  value: number,
  min: number,
  max: number,
  percentFormat: "float" | "int" = "float",
): number => {
  // biome-ignore lint/style/noParameterAssign: Must clamp value between min/max to avoid invalid percentages!
  value = clamp(value, min, max);
  // Prevent division by zero (as well as other unnecessary operations)
  if (value === min) return 0;

  const multiplier = percentFormat === "float" ? 1 : 100;
  return ((value - min) / (max - min)) * multiplier;
};

/**
 * Get a percent based on a game indicator (contains current value and corresponding range)
 *
 * @param percentFormat - Whether output percent should be an int (`0-100`) or a float (`0-1`)
 */
export const getPercentFromIndicatorValue = (
  value: IndicatorValue,
  percentFormat: "float" | "int" = "float",
): number => {
  // NOTE: Indicator values should already have safely clamped value between min/max
  return getPercentFromValue(value.current, value.min, value.max, percentFormat);
};
