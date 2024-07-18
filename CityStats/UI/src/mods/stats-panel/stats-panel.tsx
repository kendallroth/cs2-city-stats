import { bindValue, trigger, useValue } from "cs2/api";
import { infoview } from "cs2/bindings";
import { Panel, PanelSection } from "cs2/ui";
import type { CSSProperties, ReactNode } from "react";
import Draggable, {
  type DraggableData,
  type DraggableEvent,
} from "react-draggable";

import { MOD_NAME, TriggerBindings, ValueBindings } from "constants";
import cemeteryIcon from "assets/icons/cemetery.svg";
import dragIcon from "assets/icons/drag-horizontal.svg";
import sewageIcon from "assets/icons/sewage.svg";
import trashIcon from "assets/icons/trash.svg";
import unemploymentIcon from "assets/icons/unemployment.svg";
import StatIcon from "components/stat-icon/stat-icon";
import { usePhotoMode } from "hooks/use-photo-mode";
import type { Vector2 } from "types/unity.types";
import { getHexOpacity } from "utilities/color.util";
import {
  getPercentFromIndicatorValue,
  getPercentFromValue,
} from "utilities/number.util";
import panelStyles from "./stats-panel.module.scss";
import {
  type StatsPanelColorScaleStep,
  colorScaleDefault,
  getIconColor,
  iconColors,
} from "./utilities";

interface StatsPanelItem {
  children?: ReactNode;
  color?: string;
  colorScale?: StatsPanelColorScaleStep[];
  icon: string;
  iconStyle?: CSSProperties;
  label?: string;
  tooltip?: string;
  value: number;
}

const panelPosition$ = bindValue<Vector2>(MOD_NAME, ValueBindings.panelPosition, {x: 10, y: 10});
const panelVisible$ = bindValue<boolean>(MOD_NAME, ValueBindings.panelVisible, false);

// TODO: Improve performance by only subscribing to stats and rerendering when panel is visible, which
//         will require a wrapper component since hooks must be executed before returning 'null'!

const StatsPanel = () => {
  const panelPosition = useValue(panelPosition$);
  const panelVisible = useValue(panelVisible$);

  const photoMode = usePhotoMode();

  const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
    trigger(MOD_NAME, TriggerBindings.setPanelPosition, { x: data.x, y: data.y } satisfies Vector2);
  };

  // Utilities
  const electricityAvailability = useValue(infoview.electricityAvailability$);
  const electricityAvailabilityPercent = getPercentFromIndicatorValue(
    electricityAvailability,
    "float"
  );
  const waterAvailability = useValue(infoview.waterAvailability$);
  const waterAvailabilityPercent = getPercentFromIndicatorValue(
    waterAvailability,
    "float"
  );

  const sewageAvailability = useValue(infoview.sewageAvailability$);
  const sewageAvailabilityPercent = getPercentFromIndicatorValue(
    sewageAvailability,
    "float"
  );

  // Calculating garbage processing rate is more complicated (no existing calculation). Instead, the
  //   production and processing rates are compared, and used to determine a percentage. If either value
  //   is more than double the other, it is capped at double (for better display).
  const garbageDifferenceMultiplierCap = 2;
  const calculateGarbageRate = (
    productionRate: number,
    processingRate: number
  ) => {
    // Cap output when processing or production rate are more than double the other
    if (processingRate < productionRate / garbageDifferenceMultiplierCap)
      return -1;
    if (processingRate > garbageDifferenceMultiplierCap * productionRate)
      return 1;

    // Ensure division-by-zero is handled via defaulting values to smallest possible float
    return processingRate < productionRate
      ? processingRate / (productionRate || Number.EPSILON) - 1
      : 1 - productionRate / (processingRate || Number.EPSILON);
  };
  const garbageProductionRate = useValue(infoview.garbageProductionRate$);
  const garbageProcessingRate = useValue(infoview.garbageProcessingRate$);
  const garbageAvailability = calculateGarbageRate(
    garbageProductionRate,
    garbageProcessingRate
  );
  // NOTE: Until garbage processing has been unlocked
  const garbageProcessingPercent = getPercentFromValue(
    garbageAvailability,
    -1 / garbageDifferenceMultiplierCap,
    1 / garbageDifferenceMultiplierCap,
    "float"
  );
  const landfillAvailability = useValue(infoview.landfillAvailability$);
  const landfillAvailabilityPercent = getPercentFromIndicatorValue(
    landfillAvailability,
    "float"
  );
  const garbageDisabled = garbageProductionRate === 0;

  // Administration
  const fireHazard = useValue(infoview.averageFireHazard$);
  const fireHazardPercent = getPercentFromIndicatorValue(fireHazard, "float");
  const crimeRate = useValue(infoview.averageCrimeProbability$);
  const crimeRatePercent = getPercentFromIndicatorValue(crimeRate, "float");

  // Healthcare
  const healthcareAvailability = useValue(infoview.healthcareAvailability$);
  const healthcareAvailabilityPercent = getPercentFromIndicatorValue(
    healthcareAvailability,
    "float"
  );
  const cemeteryAvailability = useValue(infoview.cemeteryAvailability$);
  const cemeteryAvailabilityPercent = getPercentFromIndicatorValue(
    cemeteryAvailability,
    "float"
  );

  // Education
  const educationElementaryAvailability = useValue(
    infoview.elementaryAvailability$
  );
  const educationElementaryAvailabilityPercent = getPercentFromIndicatorValue(
    educationElementaryAvailability,
    "float"
  );
  const educationHighSchoolAvailability = useValue(
    infoview.highSchoolAvailability$
  );
  const educationHighSchoolAvailabilityPercent = getPercentFromIndicatorValue(
    educationHighSchoolAvailability,
    "float"
  );
  const educationCollegeAvailability = useValue(infoview.collegeAvailability$);
  const educationCollegeAvailabilityPercent = getPercentFromIndicatorValue(
    educationCollegeAvailability,
    "float"
  );
  const educationUniversityAvailability = useValue(
    infoview.universityAvailability$
  );
  const educationUniversityAvailabilityPercent = getPercentFromIndicatorValue(
    educationUniversityAvailability,
    "float"
  );

  // Work
  const unemployment = useValue(infoview.unemployment$);
  const unemploymentPercent = unemployment > 0 ? unemployment / 100 : 0;

  const statsPanelItems: StatsPanelItem[] = [
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Electricity.svg",
      value: electricityAvailabilityPercent,
      tooltip: "Electricity Availability",
    },
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Water.svg",
      value: waterAvailabilityPercent,
      tooltip: "Water Availability",
    },
    {
      colorScale: colorScaleDefault,
      icon: sewageIcon,
      iconStyle: { padding: "5%" },
      value: sewageAvailabilityPercent,
      tooltip: "Sewage Treatment",
    },
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Garbage.svg",
      value: garbageProcessingPercent,
      tooltip: "Garbage Processing",
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
      value: landfillAvailabilityPercent,
      tooltip: "Landfill Availability",
    },
    {
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Healthcare.svg",
      value: healthcareAvailabilityPercent,
      tooltip: "Healthcare Availability",
    },
    {
      colorScale: [
        { color: iconColors.bad, start: 0 },
        { color: iconColors.badLight, start: 0.25 },
        { color: iconColors.goodLight, start: 0.5 },
        { color: iconColors.good, start: 0.75 },
      ],
      icon: cemeteryIcon,
      iconStyle: { padding: "10%" },
      value: cemeteryAvailabilityPercent,
      tooltip: "Cemetery Availability",
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.33 },
        { color: iconColors.badLight, start: 0.5 },
        { color: iconColors.bad, start: 0.66 },
      ],
      icon: "Media/Game/Icons/FireSafety.svg",
      value: fireHazardPercent,
      tooltip: "Fire Hazard",
    },
    {
      colorScale: [
        { color: iconColors.good, start: 0 },
        { color: iconColors.goodLight, start: 0.2 },
        { color: iconColors.badLight, start: 0.4 },
        { color: iconColors.bad, start: 0.66 },
      ],
      icon: "Media/Game/Icons/Police.svg",
      value: crimeRatePercent,
      tooltip: "Crime Rate",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>E</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      value: educationElementaryAvailabilityPercent,
      tooltip: "Elementary Availability",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>H</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      value: educationHighSchoolAvailabilityPercent,
      tooltip: "Highschool Availability",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>C</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      value: educationCollegeAvailabilityPercent,
      tooltip: "College Availability",
    },
    {
      children: <div className={panelStyles.statIconEducationText}>U</div>,
      colorScale: colorScaleDefault,
      icon: "Media/Game/Icons/Education.svg",
      value: educationUniversityAvailabilityPercent,
      tooltip: "University Availability",
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
      value: unemploymentPercent,
      tooltip: "Unemployment",
    },
  ];

  // Hide panel in photo mode (or when hidden otherwise)
  if (!panelVisible || photoMode.active) {
    return null;
  }

  return (
    <Draggable
      // bounds="parent"
      defaultClassNameDragging={panelStyles.panelVisible}
      handle={`.${panelStyles.dragButton}`}
      grid={[10, 10]}
      position={panelPosition}
      onStop={handleDragStop}>
      {/* Empty parent is required to use 'transform' style on panel to center on screen (would be overridden by 'Draggable') */}
      <div>
        <Panel className={panelStyles.panel}>
          <div className={panelStyles.dragButton}>
            <img
              alt="drag"
              className={panelStyles.dragButtonIcon}
              src={dragIcon}
            />
          </div>
          <PanelSection>
            <div className={panelStyles.panelStatsRow}>
              {statsPanelItems.map((item, idx) => {
                const iconColor = getIconColor(item.colorScale, item.value);
                return (
                  <StatIcon
                    key={item.tooltip || item.icon || idx}
                    color={iconColor}
                    fill={`${iconColor}${getHexOpacity(0.25)}`}
                    icon={item.icon}
                    iconStyle={item.iconStyle}
                    progress={item.value}
                    size={40}
                    style={{
                      marginLeft: idx > 0 ? "4rem" : undefined,
                    }}
                    tooltip={item.tooltip}
                    // trackColor={`#ffffff${getHexOpacity(0.15)}`}
                  >
                    {item.children}
                  </StatIcon>
                );
              })}
            </div>
          </PanelSection>
        </Panel>
      </div>
    </Draggable>
  );
};

export default StatsPanel;
