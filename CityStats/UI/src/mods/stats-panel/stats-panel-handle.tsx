import clsx from "clsx";
import type { CSSProperties } from "react";

import dragIconHorizontal from "assets/icons/drag-horizontal.svg";
import type { StatsPanelOrientation } from "types/settings.types";
import handleStyles from "./stats-panel-handle.module.scss";

interface StatsPanelHandleProps {
  className?: string;
  mode: `${StatsPanelOrientation}`;
  style?: CSSProperties;
}

const StatsPanelHandle = (props: StatsPanelHandleProps) => {
  const { className, mode, style } = props;

  return (
    <div
      className={clsx([
        handleStyles.handle,
        mode === "Horizontal" ? handleStyles.handleHorizontal : handleStyles.handleVertical,
        className,
      ])}
      style={style}
    >
      <img alt="drag-handle" className={handleStyles.handleIcon} src={dragIconHorizontal} />
    </div>
  );
};

export default StatsPanelHandle;
