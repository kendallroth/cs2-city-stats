// TODO: Get these colors from theme somehow?
export const iconColors = {
  normal: "#00C3F1",
  bad: "#FF4E18",
  badLight: "#FF831B",
  goodLight: "#63B506",
  good: "#479436",
};

export interface StatsPanelColorScaleStep {
  color: string;
  /** Lowest value within this color's step */
  start: number;
}

/**
 * Get an icon color from a stepped color scale
 *
 * Values will use the color from the highest step they fit within, since color steps are from left-to-right.
 */
export const getIconColor = (
  colorScale: StatsPanelColorScaleStep[] | undefined,
  value: number | undefined,
): string => {
  if (!colorScale || (!value && value !== 0)) {
    return iconColors.normal;
  }

  for (let i = colorScale.length - 1; i >= 0; i--) {
    const colorItem = colorScale[i];
    if (value >= colorItem.start) {
      return colorItem.color;
    }
  }

  return colorScale[0].color;
};

export const colorScaleDefault: StatsPanelColorScaleStep[] = [
  { color: iconColors.bad, start: 0 },
  { color: iconColors.badLight, start: 0.4 },
  { color: iconColors.goodLight, start: 0.5 },
  { color: iconColors.good, start: 0.6 },
];

export const colorScaleGradual: StatsPanelColorScaleStep[] = [
  { color: iconColors.bad, start: 0 },
  { color: iconColors.badLight, start: 0.25 },
  { color: iconColors.goodLight, start: 0.5 },
  { color: iconColors.good, start: 0.75 },
];

/**
 * Convert monthly production and processing values to an availability percent.
 *
 * Availability is calculated as the percent of production satisfied by processing, with a
 *   multiplier cap implemented to provide 0/100% values once one value offsets the other by a given amount
 */
export const getAvailabilityFromProductionAndProcessing = (
  productionRate: number,
  processingRate: number,
  multiplierCap = 2,
) => {
  // Cap output when processing or production rate are more than double the other
  if (processingRate < productionRate / multiplierCap) return -1;
  if (processingRate > multiplierCap * productionRate) return 1;

  // Ensure division-by-zero is handled via defaulting values to smallest possible float
  return processingRate < productionRate
    ? processingRate / (productionRate || Number.EPSILON) - 1
    : 1 - productionRate / (processingRate || Number.EPSILON);
};
