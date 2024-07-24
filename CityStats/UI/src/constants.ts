export const MOD_NAME = "CityStats";

/** C# value binding names */
export enum ValueBindings {
  /** List of hidden stats (comma-separated list) */
  hiddenStats = "hiddenStats",
  /** Whether panel should open on game load */
  panelOpenOnLoad = "panelOpenOnLoad",
  panelOrientation = "panelOrientation",
  /** Panel position (stored as offset from orientation's default location) */
  panelPosition = "panelPosition",
  panelVisible = "panelVisible",
}

/** C# trigger binding names */
export enum TriggerBindings {
  setHiddenStats = "setHiddenStats",
  setPanelPosition = "setPanelPosition",
  setPanelVisibility = "setPanelVisibility",
  togglePanelVisible = "togglePanelVisible",
}

/** Statistic IDs (for visibility, configuration, etc) */
export const statIds = [
  "electricityAvailability",
  "waterAvailability",
  "sewageAvailability",
  "garbageAvailability",
  "landfillAvailability",
  "healthcareAvailability",
  "cemeteryAvailability",
  "fireHazard",
  "crimeRate",
  "educationElementaryAvailability",
  "educationHighschoolAvailability",
  "educationCollegeAvailability",
  "educationUniversityAvailability",
  "unemployment",
] as const;

export const panelEditingColor = "#ffaa00";
