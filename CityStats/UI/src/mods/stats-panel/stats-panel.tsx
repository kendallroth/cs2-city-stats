import { bindValue, trigger, useValue } from "cs2/api";
import { Panel, PanelSection } from "cs2/ui";
import type { CSSProperties, ReactNode } from "react";
import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";

import { MOD_NAME, TriggerBindings, ValueBindings } from "constants";
import clsx from "clsx";
import StatIcon from "components/stat-icon/stat-icon";
import { useGameInfo } from "hooks/use-game-info";
import { StatsPanelOrientation } from "types/settings.types";
import type { Vector2 } from "types/unity.types";
import { getHexOpacity } from "utilities/color.util";
import StatsPanelHandle from "./stats-panel-handle";
import handleStyles from "./stats-panel-handle.module.scss";
import { useStatsPanelItems } from "./stats-panel-items.hook";
import panelStyles from "./stats-panel.module.scss";
import { getIconColor } from "./utilities";

const panelOrientation$ = bindValue<StatsPanelOrientation>(
  MOD_NAME,
  ValueBindings.panelOrientation,
  StatsPanelOrientation.Horizontal,
);
const panelPosition$ = bindValue<Vector2>(MOD_NAME, ValueBindings.panelPosition, { x: 0, y: 0 });
const panelVisible$ = bindValue<boolean>(MOD_NAME, ValueBindings.panelVisible, false);

// TODO: Improve performance by only subscribing to stats and rerendering when panel is visible, which
//         will require a wrapper component since hooks must be executed before returning 'null'!

const StatsPanel = () => {
  const panelOrientation = useValue(panelOrientation$);
  const panelPosition = useValue(panelPosition$);
  const panelVisible = useValue(panelVisible$);

  const inHorizontalMode = panelOrientation === StatsPanelOrientation.Horizontal;
  const panelOrientationClass = inHorizontalMode
    ? panelStyles.panelHorizontal
    : panelStyles.panelVertical;
  const panelRowOrientationStyle: CSSProperties = {
    flexDirection: inHorizontalMode ? "row" : "column",
  };

  const gameInfo = useGameInfo();

  const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
    trigger(MOD_NAME, TriggerBindings.setPanelPosition, { x: data.x, y: data.y } satisfies Vector2);
  };

  const statsPanelItems = useStatsPanelItems();

  // Hide panel in photo mode or editor (or when hidden otherwise)
  if (!panelVisible || gameInfo.inPhotoMode || gameInfo.inEditor) {
    return null;
  }

  return (
    <Draggable
      // bounds="parent"
      defaultClassNameDragging={panelStyles.panelVisible}
      handle={`.${handleStyles.handle}`}
      grid={[10, 10]}
      position={panelPosition}
      onStop={handleDragStop}
    >
      {/* Empty parent is required to use 'transform' style on panel to center on screen (would be overridden by 'Draggable') */}
      <div>
        <Panel className={clsx([panelStyles.panel, panelOrientationClass])}>
          {inHorizontalMode ? (
            <>
              <StatsPanelHandle mode="Horizontal" style={{ top: "-10rem" }} />
            </>
          ) : (
            <>
              <StatsPanelHandle mode="Vertical" style={{ right: "-10rem" }} />
              <StatsPanelHandle mode="Vertical" style={{ left: "-10rem" }} />
            </>
          )}
          <PanelSection>
            <div className={panelStyles.panelStatsRow} style={panelRowOrientationStyle}>
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
                      marginLeft: inHorizontalMode && idx > 0 ? "4rem" : undefined,
                      marginTop: !inHorizontalMode && idx > 0 ? "4rem" : undefined,
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
