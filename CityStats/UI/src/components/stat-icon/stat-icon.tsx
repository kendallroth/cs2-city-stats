import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";

import { panelEditingColor } from "constants";
import { Tooltip } from "cs2/ui";
import { getHexOpacity } from "utilities/color.util";
import { clamp, getPercentFromValue } from "utilities/number.util";
import iconStyles from "./stat-icon.module.scss";
import { calculateArc } from "./utilities";

type CircleStartAngle = "top" | "left" | "bottom" | "right";

const startAngleMap: Record<CircleStartAngle, number> = {
  bottom: 180,
  left: 270,
  right: 90,
  top: 0,
};

interface StatIconProps {
  children?: ReactNode;
  /** Progress circle line color */
  color?: string;
  /** Whether stat icon is in edit mode (ie. when toggling hidden icons) */
  editing?: boolean;
  /** Progress circle background color */
  fill?: string;
  /** Whether stat icon is hidden (by user) */
  hidden?: boolean;
  icon?: string;
  iconStyle?: CSSProperties;
  /** Progress value value (usually decimal percentage) */
  progress: number;
  /** Maximum value (defaults to `1`) */
  progressMax?: number;
  /** Minimum value (defaults to `0`) */
  progressMin?: number;
  /** Overall height/width */
  size?: number;
  /** Start angle for arc calculations (for numeric, `0` is top with clockwise values) */
  startAngle?: CircleStartAngle | number;
  style?: CSSProperties;
  tooltip?: string;
  /** Progress track background color */
  trackColor?: string;
  /** Progress track width */
  trackWidth?: number;
  onClick?: () => void;
}

const StatIcon = (props: StatIconProps) => {
  const {
    children,
    color: _color,
    editing,
    fill: _fill = "none",
    hidden,
    icon,
    iconStyle,
    size = 40,
    progress,
    progressMax = 1,
    progressMin = 0,
    startAngle: startAngleRaw = "top",
    style,
    tooltip: _tooltip,
    trackColor: _trackColor,
    trackWidth = 3,
    onClick,
  } = props;

  const tooltip = !hidden ? _tooltip : `${_tooltip} (hidden)`;

  let progressPercent = getPercentFromValue(progress, progressMin, progressMax, "float");
  const minMaxProgressOffset = 0.005;
  progressPercent = clamp(progressPercent, progressMin, progressMax);
  // Must prevent progress percent from reaching max value as this will cause SVG arc to appear invisible,
  //   since it will treat the end as the start (ie. 0 === 360 degrees). Additionally, similar handling
  //   is performed for minimum values to ensure at least something is displayed (even if a little dot).
  if (progressPercent === progressMax) {
    progressPercent -= minMaxProgressOffset;
  } else if (progressPercent <= progressMin + minMaxProgressOffset) {
    progressPercent = minMaxProgressOffset;
  }

  const center = size / 2;
  const radius = center - trackWidth;

  const startAngle =
    typeof startAngleRaw === "number" ? startAngleRaw : startAngleMap[startAngleRaw];
  const arcString = calculateArc(
    center,
    center,
    radius,
    startAngle,
    (startAngle + 360) * progressPercent,
  );

  let fill = _fill;
  let color = _color;
  const trackColor = _trackColor;
  if (editing) {
    fill = !hidden ? `${panelEditingColor}${getHexOpacity(0.25)}` : `#ffffff${getHexOpacity(0.25)}`;
    color = !hidden ? panelEditingColor : "gray";
  }

  const svgStyle: CSSProperties = {
    width: `${size}rem`,
    height: `${size}rem`,
  };
  const rootStyle: CSSProperties = {
    ...style,
    display: !editing && hidden ? "none" : undefined,
    opacity: editing && hidden ? 0.6 : undefined,
  };

  return (
    <Tooltip direction="down" tooltip={tooltip}>
      <div className={iconStyles.statIconRoot} style={rootStyle} onClick={onClick}>
        {/* biome-ignore lint/a11y/noSvgWithoutTitle: Not necessary in game */}
        <svg style={svgStyle} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={center}
            cy={center}
            fill={fill}
            r={radius}
            stroke={trackColor}
            strokeWidth={trackWidth}
          />
          <path
            fill="none"
            d={arcString}
            stroke={color}
            strokeLinecap="round"
            strokeWidth={trackWidth}
          />
        </svg>
        {icon && (
          <img
            alt="icon"
            className={clsx([iconStyles.statIcon, iconStyles.statIconWhite])}
            src={icon}
            style={iconStyle}
          />
        )}
        {children}
      </div>
    </Tooltip>
  );
};

export default StatIcon;
