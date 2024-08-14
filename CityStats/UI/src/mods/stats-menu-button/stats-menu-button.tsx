import { Button } from "cs2/ui";

import menuIcon from "assets/logo.svg";
import { MOD_NAME, TriggerBindings } from "constants";
import { trigger } from "cs2/api";
import { useLocalization } from "cs2/l10n";
import { useGameInfo } from "hooks/use-game-info";
import VanillaComponents from "vanilla/component-bindings";
import menuButtonStyles from "./stats-menu-button.module.scss";

const { DescriptionTooltip } = VanillaComponents.components;

const StatsMenuButton = () => {
  const gameInfo = useGameInfo();
  const { translate: t } = useLocalization();

  const onClick = () => {
    trigger(MOD_NAME, TriggerBindings.togglePanelVisible);
  };

  // Hide menu button in photo mode or editor
  if (gameInfo.inPhotoMode || gameInfo.inEditor) {
    return null;
  }

  return (
    <DescriptionTooltip
      description={t(
        "CityStats.ToolbarActions[TogglePanel].TooltipDescription",
        "View important city statistics at a glance",
      )}
      title={t("CityStats.ToolbarActions[TogglePanel].TooltipTitle", "City Stats")}
    >
      <Button style={{ position: "relative" }} variant="floating" onClick={onClick}>
        <img alt="logo" src={menuIcon} className={menuButtonStyles.menuButtonIcon} />
      </Button>
    </DescriptionTooltip>
  );
};

export default StatsMenuButton;
