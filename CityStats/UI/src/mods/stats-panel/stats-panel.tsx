import clsx from "clsx";
import { bindValue, trigger, useValue } from "cs2/api";
import { Button, Panel, PanelSection, Tooltip } from "cs2/ui";
import { type CSSProperties, useEffect, useState } from "react";
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
import { type StatsPanelItem, useStatsPanelItems } from "./stats-panel-items.hook";
import panelStyles from "./stats-panel.module.scss";
import { getIconColor } from "./utilities";

const hiddenStats$ = bindValue<string>(MOD_NAME, ValueBindings.hiddenStats, "");
const panelOrientation$ = bindValue<StatsPanelOrientation>(
  MOD_NAME,
  ValueBindings.panelOrientation,
  StatsPanelOrientation.Horizontal,
);
const panelPosition$ = bindValue<Vector2>(MOD_NAME, ValueBindings.panelPosition, { x: 0, y: 0 });
const panelVisible$ = bindValue<boolean>(MOD_NAME, ValueBindings.panelVisible, false);

// TODO: Improve performance by only subscribing to stats and rerendering when panel is visible, which
//         will require a wrapper component since hooks must be executed before returning 'null'!

// TODO: Show number of hidden stats near the settings button (maybe in badge?)

const StatsPanel = () => {
  const hiddenStatsString = useValue(hiddenStats$);
  const panelOrientation = useValue(panelOrientation$);
  const panelPosition = useValue(panelPosition$);
  const panelVisible = useValue(panelVisible$);

  const gameInfo = useGameInfo();

  const [editing, setEditing] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  const handlesVisible = dragging || hovering || editing;
  const inHorizontalMode = panelOrientation === StatsPanelOrientation.Horizontal;

  // C# state tracks the hidden stats as a raw comma-separated string, while JS uses a Set for performance.
  const [hiddenStats, setHiddenStats] = useState(new Set<StatId>());
  const allStatsHidden = hiddenStats.size === statIds.length;

  useEffect(() => {
    const statsRaw = hiddenStatsString.split(",") as StatId[];
    // Ensure only valid stats are parsed
    const stats = statsRaw.filter((s) => statIds.includes(s));
    setHiddenStats(new Set(stats));

    logger.debug("Updating hidden stats", stats);
  }, [hiddenStatsString]);

  /** Toggle whether a stat is hidden (via editing mode) */
  const toggleStat = (stat: StatId) => {
    logger.debug("Toggling stat visibility", stat);

    let newHiddenStatsString = "";
    const hiddenStatsArray = Array.from(hiddenStats.values());

    if (hiddenStats.has(stat)) {
      const newStats = hiddenStatsArray.filter((s) => s !== stat);
      newHiddenStatsString = newStats.join(",");
    } else {
      const newStats = [...hiddenStatsArray, stat];
      newHiddenStatsString = newStats.join(",");
    }

    trigger(MOD_NAME, TriggerBindings.setHiddenStats, newHiddenStatsString);
  };

  const handleDragStart = () => {
    setDragging(true);
  };

  /** Update panel position after drag finishes */
  const handleDragStop = (_event: DraggableEvent, data: DraggableData) => {
    setDragging(false);
    trigger(MOD_NAME, TriggerBindings.setPanelPosition, { x: data.x, y: data.y } satisfies Vector2);
  };

  const handleSettingsToggle = () => {
    // Prevent saving changes when all settings are hidden (useless)
    if (editing && allStatsHidden) {
      return;
    }

    setEditing(!editing);
  };

  const statsPanelItems = useStatsPanelItems({ hiddenStats: hiddenStats });

  const handleStatClick = (stat: StatsPanelItem) => {
    if (!editing) return;

    // TODO: Figure out how to play sound (likely use 'Button' component?)
    toggleStat(stat.id);
  };

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
      onStart={handleDragStart}
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
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {inHorizontalMode ? (
            <>
              <StatsPanelHandle mode="Horizontal" style={{ top: 0 }} visible={handlesVisible} />
            </>
          ) : (
            <>
              <StatsPanelHandle
                mode="Vertical"
                style={{ right: "-4rem" }}
                visible={handlesVisible}
              />
              <StatsPanelHandle
                mode="Vertical"
                style={{ left: "-4rem" }}
                visible={handlesVisible}
              />
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
                      onClick={() => handleStatClick(item)}
                    >
                      {item.children}
                    </StatIcon>
                  );
                })}
                {/* NOTE: It never should be possible to hide all stats! */}
                {allStatsHidden && !editing && (
                  <div className={panelStyles.panelStatsAllHidden}>All stats hidden</div>
                )}
              </div>

              <div
                className={panelStyles.panelStatsAppend}
                style={{
                  flexDirection: inHorizontalMode ? "row" : "column",
                  marginLeft: inHorizontalMode ? "4rem" : undefined,
                  marginTop: !inHorizontalMode ? "2rem" : undefined,
                }}
              >
                {!!hiddenStats.size && (
                  <Tooltip
                    direction={inHorizontalMode ? "down" : "right"}
                    tooltip={`${hiddenStats.size} additional stats`}
                  >
                    <div
                      className={panelStyles.panelStatsHiddenCount}
                      style={{
                        marginRight: inHorizontalMode ? "4rem" : undefined,
                        marginBottom: !inHorizontalMode ? "2rem" : undefined,
                      }}
                    >
                      {/* Equivalent to '&hairsp;' which rendered as text... */}
                      +&#8202;{hiddenStats.size}
                    </div>
                  </Tooltip>
                )}
                <Tooltip
                  direction={inHorizontalMode ? "down" : "right"}
                  tooltip="Toggle stat visibility"
                >
                  <Button
                    className={panelStyles.settingsButton}
                    style={{}}
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
            </div>
          </PanelSection>
        </Panel>
      </div>
    </Draggable>
  );
};

export default StatsPanel;
