import { Button } from "cs2/ui";

import menuIcon from "assets/logo.svg";
import VanillaBindings from "vanilla-bindings";
import menuButtonStyles from "./stats-button.module.scss";

const { DescriptionTooltip } = VanillaBindings.components;

interface StatsButtonProps {
  onClick: () => void;
}

const StatsButton = (props: StatsButtonProps) => {
  const { onClick } = props;

  return (
    <DescriptionTooltip description="View important city statistics at a glance" title="City Stats">
      <Button style={{ position: "relative" }} variant="floating" onClick={onClick}>
        <img alt="logo" src={menuIcon} className={menuButtonStyles.menuButtonIcon} />
      </Button>
    </DescriptionTooltip>
  );
};

export default StatsButton;
