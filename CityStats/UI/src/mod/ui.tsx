import { useState } from "react";

import StatsButton from "./menu-button/stats-button";
import StatsPanel from "./panel/stats-panel";

const StatsMod = () => {
  // TODO: Persist panel open status
  const [panelOpen, setPanelOpen] = useState(false);

  const handleMenuButtonClick = () => {
    setPanelOpen((value) => !value);
  };

  // TODO: Persist panel position
  const [position, setPosition] = useState<{ x: number; y: number; }>();

  return (
    <>
      <StatsButton onClick={handleMenuButtonClick} />
      {/* TODO: Animate panel opening and closing */}
      {panelOpen && (
        <StatsPanel position={position} onPositionChange={setPosition} />
      )}
    </>
  );
};

export default StatsMod;
