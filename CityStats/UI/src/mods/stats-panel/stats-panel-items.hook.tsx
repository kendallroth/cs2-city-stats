import { useValue } from "cs2/api";
import { infoview } from "cs2/bindings";
import { useLocalization } from "cs2/l10n";
import type { CSSProperties, ReactNode } from "react";

import electricityIcon from "assets/icons/font-awesome/electricity.svg";
import garbageIcon from "assets/icons/font-awesome/garbage.svg";
import healthcareAvailabilityIcon from "assets/icons/font-awesome/healthcare-availability.svg";
import mailIcon from "assets/icons/font-awesome/mail.svg";
import parkingIcon from "assets/icons/font-awesome/parking.svg";
import sewageIcon from "assets/icons/font-awesome/sewage.svg";
import waterIcon from "assets/icons/font-awesome/water.svg";
import cemeteryIcon from "assets/icons/material/cemetery-availability.svg";
import cremationIcon from "assets/icons/material/crematory-availability.svg";
import crimeRateIcon from "assets/icons/material/crime-rate.svg";
import fireHazardIcon from "assets/icons/material/fire-hazard.svg";
import homelessnessIcon from "assets/icons/material/homlessness.svg";
import trashIcon from "assets/icons/material/landfill-availability.svg";
import emergencyIcon from "assets/icons/material/shelter-availability.svg";
import unemploymentIcon from "assets/icons/material/unemployment.svg";
import type { StatId } from "types/stats.types";
import { getPercentFromIndicatorValue, getPercentFromValue } from "utilities/number.util";
import type { InfoviewID } from "vanilla/types";
import panelStyles from "./stats-panel.module.scss";
import {
  type StatsPanelColorScaleStep,
  colorScaleDefault,
  colorScaleGradual,
  getAvailabilityFromProductionAndProcessing,
  iconColors,
} from "./utilities";

export interface StatsPanelItem {
  children?: ReactNode;
  color?: string;
  colorScale?: StatsPanelColorScaleStep[];
  hidden?: boolean;
  id: StatId;
  /** NOTE: Most stats uses custom (ie. not in-game) icons due to game's change to 3D icons... */
  icon: string;
  infoviewId: InfoviewID;
  iconStyle?: CSSProperties;
  label?: string;
  tooltip?: string;
  value: number;
  /**
   * Apply exponential stretching/compressing (low vs high) for display purposes only
   *
   * Exponent should be between `0-1`, where smaller values result in more stretching/compressing.
   */
  valueExponent?: number;
}

interface StatsPanelItemsOptions {
  hiddenStats?: Set<string>;
}

export const useStatsPanelItems = (options: StatsPanelItemsOptions = {}) => {
  const { hiddenStats } = options;
  const { translate: t } = useLocalization();

  // Utilities
  const electricityAvailability = useValue(infoview.electricityAvailability$);
  const electricityAvailabilityPercent = getPercentFromIndicatorValue(
    electricityAvailability,
    "float",
  );
  const waterAvailability = useValue(infoview.waterAvailability$);
  const waterAvailabilityPercent = getPercentFromIndicatorValue(waterAvailability, "float");

  const sewageAvailability = useValue(infoview.sewageAvailability$);
  const sewageAvailabilityPercent = getPercentFromIndicatorValue(sewageAvailability, "float");

  const garbageDifferenceMultiplierCap = 2;
  const garbageProductionMonthly = useValue(infoview.garbageProductionRate$);
  const garbageProcessingMonthly = useValue(infoview.garbageProcessingRate$);
  const garbageAvailability = getAvailabilityFromProductionAndProcessing(
    garbageProductionMonthly,
    garbageProcessingMonthly,
    garbageDifferenceMultiplierCap,
  );
  // TODO?: Lock/hide until garbage processing has been unlocked
  const garbageProcessingPercent = getPercentFromValue(
    garbageAvailability,
    -1 / garbageDifferenceMultiplierCap,
    1 / garbageDifferenceMultiplierCap,
    "float",
  );
  const landfillAvailability = useValue(infoview.landfillAvailability$);
  const landfillAvailabilityPercent = getPercentFromIndicatorValue(landfillAvailability, "float");

  // Administration
  const fireHazard = useValue(infoview.averageFireHazard$);
  const fireHazardPercent = getPercentFromIndicatorValue(fireHazard, "float");
  const crimeRate = useValue(infoview.averageCrimeProbability$);
  const crimeRatePercent = getPercentFromIndicatorValue(crimeRate, "float");
  const shelterAvailability = useValue(infoview.shelterAvailability$);
  const shelterAvailabilityPercent = getPercentFromIndicatorValue(shelterAvailability, "float");

  // Healthcare
  const healthcareAvailability = useValue(infoview.healthcareAvailability$);
  const healthcareAvailabilityPercent = getPercentFromIndicatorValue(
    healthcareAvailability,
    "float",
  );
  const cemeteryAvailability = useValue(infoview.cemeteryAvailability$);
  const cemeteryAvailabilityPercent = getPercentFromIndicatorValue(cemeteryAvailability, "float");
  const cremationAvailability = useValue(infoview.deathcareAvailability$);
  const cremationAvailabilityPercent = getPercentFromIndicatorValue(cremationAvailability, "float");

  // Education
  const educationElementaryAvailability = useValue(infoview.elementaryAvailability$);
  const educationElementaryAvailabilityPercent = getPercentFromIndicatorValue(
    educationElementaryAvailability,
    "float",
  );
  const educationHighSchoolAvailability = useValue(infoview.highSchoolAvailability$);
  const educationHighSchoolAvailabilityPercent = getPercentFromIndicatorValue(
    educationHighSchoolAvailability,
    "float",
  );
  const educationCollegeAvailability = useValue(infoview.collegeAvailability$);
  const educationCollegeAvailabilityPercent = getPercentFromIndicatorValue(
    educationCollegeAvailability,
    "float",
  );
  const educationUniversityAvailability = useValue(infoview.universityAvailability$);
  const educationUniversityAvailabilityPercent = getPercentFromIndicatorValue(
    educationUniversityAvailability,
    "float",
  );

  // Miscellaneous
  const homelessness = useValue(infoview.homelessness$);
  const homelessnessPercent = homelessness > 0 ? homelessness / 100 : 0;
  const parkingAvailability = useValue(infoview.parkingAvailability$);
  const parkingAvailabilityPercent = getPercentFromIndicatorValue(parkingAvailability);
  const unemployment = useValue(infoview.unemployment$);
  const unemploymentPercent = unemployment > 0 ? unemployment / 100 : 0;

  const mailProductionMonthly = useValue(infoview.mailProductionRate$);
  const mailCollected = useValue(infoview.collectedMail$);
  const mailDelivered = useValue(infoview.deliveredMail$);
  const mailProcessingMonthly = mailCollected + mailDelivered;
  const mailDifferenceMultiplierCap = 2;
  const mailAvailability = getAvailabilityFromProductionAndProcessing(
    mailProductionMonthly,
    mailProcessingMonthly,
    mailDifferenceMultiplierCap,
  );
  const mailAvailabilityPercent = getPercentFromValue(
    mailAvailability,
    -1 / mailDifferenceMultiplierCap,
    1 / mailDifferenceMultiplierCap,
    "float",
  );

  const getLocalizedTooltip = (item: string, fallback: string) => {
    return t(`CityStats.Stats[${item}]`, fallback) ?? "No localization!";
  };

  let statsPanelItems: StatsPanelItem[] = [
    {
      colorScale: colorScaleDefault,
      // icon: "Media/Game/Icons/Electricity.svg",
      iconStyle: {padding: "12%"},
      icon: electricityIcon,
      id: "electricityAvailability",
      infoviewId: "Electricity",
      value: electricityAvailabilityPercent,
      tooltip: getLocalizedTooltip("ElectricityAvailability", "Electricity Availability"),
    },
    {
      colorScale: colorScaleDefault,
      // icon: "Media/Game/Icons/Water.svg",
      icon: waterIcon,
      iconStyle: {padding: "12%"},
      id: "waterAvailability",
      infoviewId: "WaterPipes",
      value: waterAvailabilityPercent,
      tooltip: getLocalizedTooltip("WaterAvailability", "Water Availability"),
    },
    {
      colorScale: colorScaleDefault,
      icon: sewageIcon,
      iconStyle: { padding: "12%" },
      id: "sewageAvailability",
      infoviewId: "WaterPipes",
      value: sewageAvailabilityPercent,
      tooltip: getLocalizedTooltip("SewageTreatment", "Sewage Treatment"),
    },
    {
      colorScale: colorScaleDefault,
      // icon: "Media/Game/Icons/Garbage.svg",
      icon: garbageIcon,
      iconStyle: { padding: "12%" },
      id: "garbageAvailability",
      infoviewId: "Garbage",
      value: garbageProcessingPercent,
      tooltip: getLocalizedTooltip("GarbageProcessing", "Garbage Processing"),
    },
    {
      colorScale: [
        { color: iconColors.bad, start: 0 },
        { color: iconColors.badLight, start: 0.25 },
        { color: iconColors.good, start: 0.5 },
        { color: iconColors.goodLight, start: 0.75 },
      ],
      icon: trashIcon,
      iconStyle: { padding: "5%" },
      id: "landfillAvailability",
      infoviewId: "Garbage",
      value: landfillAvailabilityPercent,
      tooltip: getLocalizedTooltip("LandfillAvailability", "Landfill Availability"),
    },
    {
      colorScale: colorScaleDefault,
      // icon: "Media/Game/Icons/Healthcare.svg",
      icon: healthcareAvailabilityIcon,
      iconStyle: {padding: "12%"},
      id: "healthcareAvailability",
      infoviewId: "Healthcare",
      value: healthcareAvailabilityPercent,
      tooltip: getLocalizedTooltip("HealthcareAvailability", "Healthcare Availability"),
    },
    {
      colorScale: colorScaleGradual,
      icon: cemeteryIcon,
      iconStyle: { padding: "10%" },
      id: "cemeteryAvailability",
      infoviewId: "Healthcare",
      value: cemeteryAvailabilityPercent,
      tooltip: getLocalizedTooltip("CemeteryAvailability", "Cemetery Availability"),
    },
    {
      colorScale: colorScaleDefault,
      icon: cremationIcon,
      iconStyle: { padding: "4%" },
      id: "cremationAvailability",
      infoviewId: "Healthcare",
      value: cremationAvailabilityPercent,
      tooltip: getLocalizedTooltip("CrematoryAvailability", "Crematory Availability"),
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.33 },
        { color: iconColors.badLight, start: 0.5 },
        { color: iconColors.bad, start: 0.66 },
      ],
      // icon: "Media/Game/Icons/FireSafety.svg",
      icon: fireHazardIcon,
      iconStyle: {padding: "4%"},
      id: "fireHazard",
      infoviewId: "FireRescue",
      value: fireHazardPercent,
      tooltip: getLocalizedTooltip("FireHazard", "Fire Hazard"),
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.2 },
        { color: iconColors.badLight, start: 0.4 },
        { color: iconColors.bad, start: 0.66 },
      ],
      // icon: "Media/Game/Icons/Police.svg",
      icon: crimeRateIcon,
      iconStyle: {padding: "6%"},
      id: "crimeRate",
      infoviewId: "Police",
      value: crimeRatePercent,
      tooltip: getLocalizedTooltip("CrimeRate", "Crime Rate"),
    },
    {
      colorScale: colorScaleGradual,
      icon: emergencyIcon,
      iconStyle: { padding: "8%" },
      id: "shelterAvailability",
      infoviewId: "DisasterControl",
      value: shelterAvailabilityPercent,
      tooltip: getLocalizedTooltip("ShelterAvailability", "Shelter Availability"),
    },
    {
      children: <div className={panelStyles.statIconEducationText}>E</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationElementaryAvailability",
      infoviewId: "Education",
      value: educationElementaryAvailabilityPercent,
      tooltip: getLocalizedTooltip("ElementaryAvailability", "Elementary Availability"),
    },
    {
      children: <div className={panelStyles.statIconEducationText}>H</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationHighschoolAvailability",
      infoviewId: "Education",
      value: educationHighSchoolAvailabilityPercent,
      tooltip: getLocalizedTooltip("HighschoolAvailability", "Highschool Availability"),
    },
    {
      children: <div className={panelStyles.statIconEducationText}>C</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationCollegeAvailability",
      infoviewId: "Education",
      value: educationCollegeAvailabilityPercent,
      tooltip: getLocalizedTooltip("CollegeAvailability", "College Availability"),
    },
    {
      children: <div className={panelStyles.statIconEducationText}>U</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationUniversityAvailability",
      infoviewId: "Education",
      value: educationUniversityAvailabilityPercent,
      tooltip: getLocalizedTooltip("UniversityAvailability", "University Availability"),
    },
    {
      colorScale: colorScaleDefault,
      icon: mailIcon,
      iconStyle: { padding: "12%" },
      id: "mailAvailability",
      infoviewId: "PostService",
      value: mailAvailabilityPercent,
      tooltip: getLocalizedTooltip("MailAvailability", "Mail Availability"),
    },
    {
      colorScale: colorScaleDefault,
      icon: parkingIcon,
      iconStyle: { padding: "12%" },
      id: "parkingAvailability",
      infoviewId: "Roads",
      value: parkingAvailabilityPercent,
      tooltip: getLocalizedTooltip("ParkingAvailability", "Parking Availability"),
    },
    {
      // Homelessness percent values should generally be very small!
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.005 },
        { color: iconColors.badLight, start: 0.01 },
        { color: iconColors.bad, start: 0.025 },
      ],
      icon: homelessnessIcon,
      iconStyle: { padding: "12%" },
      id: "homelessness",
      infoviewId: "Residential",
      value: homelessnessPercent,
      // Homeless percent is exponentially stretched/compressed (low vs high) for better visual representation
      valueExponent: 0.6,
      tooltip: getLocalizedTooltip("Homelessness", "Homelessness"),
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.05 },
        { color: iconColors.badLight, start: 0.12 },
        { color: iconColors.bad, start: 0.2 },
      ],
      icon: unemploymentIcon,
      iconStyle: { padding: "10%" },
      id: "unemployment",
      infoviewId: "Workplaces",
      value: unemploymentPercent,
      tooltip: getLocalizedTooltip("Unemployment", "Unemployment"),
    },
  ];

  statsPanelItems = statsPanelItems.map((s) => ({
    ...s,
    hidden: hiddenStats?.has(s.id) ?? false,
  }));

  return statsPanelItems;
};
