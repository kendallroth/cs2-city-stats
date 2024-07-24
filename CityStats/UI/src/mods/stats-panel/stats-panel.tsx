import clsx from "clsx";
import { bindValue, trigger, useValue } from "cs2/api";
import { Button, Panel, PanelSection, Tooltip } from "cs2/ui";
import { type CSSProperties, useState } from "react";
import Draggable, { type DraggableData, type DraggableEvent } from "react-draggable";

import settingsOffIcon from "assets/icons/gear-off.svg";
import settingsIcon from "assets/icons/gear.svg";
import StatIcon from "components/stat-icon/stat-icon";
import { MOD_NAME, TriggerBindings, ValueBindings, panelEditingColor, statIds } from "constants";
import { useGameInfo } from "hooks/use-game-info";
import { logger } from "logger";
import { StatsPanelOrientation } from "types/settings.types";
import type { StatId } from "types/stats.types";
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

  const [editing, setEditing] = useState(false);

  // TODO: Potentially refactor to use Set
  const [hiddenStats, setHiddenStats] = useState<StatId[]>(["landfillAvailability"]);
  const allStatsHidden = hiddenStats.length === statIds.length;

  /** Toggle whether a stat is hidden (via editing mode) */
  const toggleStat = (stat: StatId) => {
    logger.log("Toggling stat", stat, hiddenStats, hiddenStats.includes(stat));

    if (hiddenStats.includes(stat)) {
      const newStats = hiddenStats.filter((s) => s !== stat);
      setHiddenStats(newStats);
    } else {
      const newStats = [...hiddenStats, stat];
      setHiddenStats(newStats);
    }
  };

  const gameInfo = useGameInfo();

  /** Update panel position after drag finishes */
  const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
    trigger(MOD_NAME, TriggerBindings.setPanelPosition, { x: data.x, y: data.y } satisfies Vector2);
  };

  const handleSettingsToggle = () => {
    // Prevent saving changes when all settings are hidden (useless)
    if (editing && allStatsHidden) {
      return;
    }

    setEditing(!editing);
  };

  const statsPanelItems = useStatsPanelItems({ hiddenStats });

  const panelOrientationClass = inHorizontalMode
    ? panelStyles.panelHorizontal
    : panelStyles.panelVertical;
  const panelRowOrientationStyle: CSSProperties = {
    flexDirection: inHorizontalMode ? "row" : "column",
  };
  const panelContentOrientationStyle: CSSProperties = {
    flexDirection: inHorizontalMode ? "row" : "column",
  };
  const panelStyle: CSSProperties = {
    borderColor: editing ? panelEditingColor : undefined,
  };

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
        <Panel
          className={clsx([
            panelStyles.panel,
            panelOrientationClass,
            { [panelStyles.panelEditing]: editing },
          ])}
          style={panelStyle}
        >
          {inHorizontalMode ? (
            <>
              <StatsPanelHandle mode="Horizontal" style={{ top: 0 }} />
            </>
          ) : (
            <>
              <StatsPanelHandle mode="Vertical" style={{ right: "-4rem" }} />
              <StatsPanelHandle mode="Vertical" style={{ left: "-4rem" }} />
            </>
          )}
          <PanelSection>
            <div className={panelStyles.panelContent} style={panelContentOrientationStyle}>
              <div className={panelStyles.panelStatsRow} style={panelRowOrientationStyle}>
                {statsPanelItems.map((item, idx) => {
                  const iconColor = getIconColor(item.colorScale, item.value);
                  return (
                    <StatIcon
                      key={item.tooltip || item.icon || idx}
                      color={iconColor}
                      editing={editing}
                      fill={`${iconColor}${getHexOpacity(0.25)}`}
                      hidden={item.hidden}
                      icon={item.icon}
                      iconStyle={item.iconStyle}
                      progress={item.value}
                      size={40}
                      style={{
                        marginLeft: inHorizontalMode && idx > 0 ? "4rem" : undefined,
                        marginTop: !inHorizontalMode && idx > 0 ? "4rem" : undefined,
                      }}
                      tooltip={item.tooltip}
                      onClick={() => toggleStat(item.id)}
                    >
                      {item.children}
                    </StatIcon>
                  );
                })}
                {allStatsHidden && !editing && (
                  <div className={panelStyles.panelStatsAllHidden}>All stats hidden</div>
                )}
              </div>

              <Tooltip
                direction={inHorizontalMode ? "down" : "right"}
                tooltip="Toggle stat visibility"
              >
                <Button
                  className={panelStyles.settingsButton}
                  style={{
                    marginLeft: inHorizontalMode ? "8rem" : undefined,
                    marginTop: !inHorizontalMode ? "8rem" : undefined,
                  }}
                  variant="round"
                  onClick={handleSettingsToggle}
                >
                  <img
                    alt="Settings"
                    className={panelStyles.settingsButtonIcon}
                    src={editing ? settingsOffIcon : settingsIcon}
                  />
                </Button>
              </Tooltip>
            </div>
          </PanelSection>
        </Panel>
      </div>
    </Draggable>
  );
};

export default StatsPanel;
