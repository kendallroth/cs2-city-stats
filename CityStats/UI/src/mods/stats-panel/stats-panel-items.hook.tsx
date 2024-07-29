import { useValue } from "cs2/api";
import { infoview } from "cs2/bindings";
import type { CSSProperties, ReactNode } from "react";

import cemeteryIcon from "assets/icons/cemetery.svg";
import cremationIcon from "assets/icons/cremation.svg";
import emergencyIcon from "assets/icons/emergency-control.svg";
import mailIcon from "assets/icons/mail.svg";
import parkingIcon from "assets/icons/parking.svg";
import sewageIcon from "assets/icons/sewage.svg";
import trashIcon from "assets/icons/trash.svg";
import unemploymentIcon from "assets/icons/unemployment.svg";
import { useLocalization } from "cs2/l10n";
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
  icon: string;
  infoviewId: InfoviewID;
  iconStyle?: CSSProperties;
  label?: string;
  tooltip?: string;
  value: number;
}

interface StatsPanelItemsOptions {
  hiddenStats?: Set<string>;
}

export const useStatsPanelItems = (options: StatsPanelItemsOptions = {}) => {
  const { hiddenStats } = options;
  const localization = useLocalization();

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
  // NOTE: Until garbage processing has been unlocked
  const garbageProcessingPercent = getPercentFromValue(
    garbageAvailability,
    -1 / garbageDifferenceMultiplierCap,
    1 / garbageDifferenceMultiplierCap,
    "float",
  );
  const landfillAvailability = useValue(infoview.landfillAvailability$);
  const landfillAvailabilityPercent = getPercentFromIndicatorValue(landfillAvailability, "float");
  const garbageDisabled = garbageProductionMonthly === 0;

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

  let statsPanelItems: StatsPanelItem[] = [
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Electricity.svg",
      id: "electricityAvailability",
      infoviewId: "Electricity",
      value: electricityAvailabilityPercent,
      tooltip:
        localization.translate(
          "CS2-City-Stats.Electricity Availability",
          "Electricity Availability",
        ) ?? "",
    },
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Water.svg",
      id: "waterAvailability",
      infoviewId: "WaterPipes",
      value: waterAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Water Availability", "Water Availability") ?? "",
    },
    {
      colorScale: colorScaleDefault,
      icon: sewageIcon,
      iconStyle: { padding: "10%" },
      id: "sewageAvailability",
      infoviewId: "WaterPipes",
      value: sewageAvailabilityPercent,
      tooltip: localization.translate("CS2-City-Stats.Sewage Treatment", "Sewage Treatment") ?? "",
    },
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Garbage.svg",
      id: "garbageAvailability",
      infoviewId: "Garbage",
      value: garbageProcessingPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Garbage Processing", "Garbage Processing") ?? "",
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
      tooltip:
        localization.translate("CS2-City-Stats.Landfill Availability", "Landfill Availability") ??
        "",
    },
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Healthcare.svg",
      id: "healthcareAvailability",
      infoviewId: "Healthcare",
      value: healthcareAvailabilityPercent,
      tooltip:
        localization.translate(
          "CS2-City-Stats.Healthcare Availability",
          "Healthcare Availability",
        ) ?? "",
    },
    {
      colorScale: colorScaleGradual,
      icon: cemeteryIcon,
      iconStyle: { padding: "10%" },
      id: "cemeteryAvailability",
      infoviewId: "Healthcare",
      value: cemeteryAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Cemetery Availability", "Cemetery Availability") ??
        "",
    },
    {
      colorScale: colorScaleDefault,
      icon: cremationIcon,
      iconStyle: { padding: "2%" },
      id: "cremationAvailability",
      infoviewId: "Healthcare",
      value: cremationAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Crematory Availability", "Crematory Availability") ??
        "",
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.33 },
        { color: iconColors.badLight, start: 0.5 },
        { color: iconColors.bad, start: 0.66 },
      ],
      icon: "Media/Game/Icons/FireSafety.svg",
      id: "fireHazard",
      infoviewId: "FireRescue",
      value: fireHazardPercent,
      tooltip: localization.translate("CS2-City-Stats.Fire Hazard", "Fire Hazard") ?? "",
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.2 },
        { color: iconColors.badLight, start: 0.4 },
        { color: iconColors.bad, start: 0.66 },
      ],
      icon: "Media/Game/Icons/Police.svg",
      id: "crimeRate",
      infoviewId: "Police",
      value: crimeRatePercent,
      tooltip: localization.translate("CS2-City-Stats.Crime Rate", "Crime Rate") ?? "",
    },
    {
      colorScale: colorScaleGradual,
      icon: emergencyIcon,
      iconStyle: { padding: "8%" },
      id: "shelterAvailability",
      infoviewId: "DisasterControl",
      value: shelterAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Shelter Availability", "Shelter Availability") ?? "",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>E</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationElementaryAvailability",
      infoviewId: "Education",
      value: educationElementaryAvailabilityPercent,
      tooltip:
        localization.translate(
          "CS2-City-Stats.Elementary Availability",
          "Elementary Availability",
        ) ?? "",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>H</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationHighschoolAvailability",
      infoviewId: "Education",
      value: educationHighSchoolAvailabilityPercent,
      tooltip:
        localization.translate(
          "CS2-City-Stats.Highschool Availability",
          "Highschool Availability",
        ) ?? "",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>C</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationCollegeAvailability",
      infoviewId: "Education",
      value: educationCollegeAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.College Availability", "College Availability") ?? "",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>U</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      id: "educationUniversityAvailability",
      infoviewId: "Education",
      value: educationUniversityAvailabilityPercent,
      tooltip:
        localization.translate(
          "CS2-City-Stats.University Availability",
          "University Availability",
        ) ?? "",
    },
    {
      colorScale: colorScaleDefault,
      icon: mailIcon,
      iconStyle: { padding: "10%" },
      id: "mailAvailability",
      infoviewId: "PostService",
      value: mailAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Mail Availability", "Mail Availability") ?? "",
    },
    {
      colorScale: colorScaleDefault,
      icon: parkingIcon,
      iconStyle: { padding: "10%" },
      id: "parkingAvailability",
      infoviewId: "Roads",
      value: parkingAvailabilityPercent,
      tooltip:
        localization.translate("CS2-City-Stats.Parking Availability", "Parking Availability") ?? "",
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
      tooltip: localization.translate("CS2-City-Stats.Unemployment", "Unemployment") ?? "",
    },
  ];

  statsPanelItems = statsPanelItems.map((s) => ({
    ...s,
    hidden: hiddenStats?.has(s.id) ?? false,
  }));

  return statsPanelItems;
};
