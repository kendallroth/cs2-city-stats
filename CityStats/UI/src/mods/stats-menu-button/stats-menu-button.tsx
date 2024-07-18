import { Button } from "cs2/ui";

import { MOD_NAME, TriggerBindings } from "constants";
import menuIcon from "assets/logo.svg";
import { trigger } from "cs2/api";
import VanillaComponents from "vanilla/component-bindings";
import menuButtonStyles from "./stats-menu-button.module.scss";

const { DescriptionTooltip } = VanillaComponents.components;

const StatsMenuButton = () => {
  const onClick = () => {
    trigger(MOD_NAME, TriggerBindings.togglePanelVisible);
  }

  return (
    <DescriptionTooltip description="View important city statistics at a glance" title="City Stats">
      <Button style={{ position: "relative" }} variant="floating" onClick={onClick}>
        <img alt="logo" src={menuIcon} className={menuButtonStyles.menuButtonIcon} />
      </Button>
    </DescriptionTooltip>
  );
};

export default StatsMenuButton;
