import { getModule } from "cs2/modding";
import type { ButtonProps, TooltipProps } from "cs2/ui";
import type { FC, ReactNode } from "react";

/** NOTE: Vanilla prop types are a best-guess currently... */
export interface DescriptionTooltipProps extends Omit<TooltipProps, "tooltip"> {
  title: string | null;
  description: string | null;
  content?: ReactNode | string | null;
}

/** Tooltip with title and description */
const DescriptionTooltip: FC<DescriptionTooltipProps> = getModule(
  "game-ui/common/tooltip/description-tooltip/description-tooltip.tsx",
  "DescriptionTooltip",
);

/** NOTE: Vanilla prop types are a best-guess currently... */
export interface ToolButtonProps extends ButtonProps {
  /** Icon source */
  src: string;
  tooltip?: string;
}

/** Toolbar icon button (with selection state) */
const ToolButton: FC<ToolButtonProps> = getModule(
  "game-ui/game/components/tool-options/tool-button/tool-button.tsx",
  "ToolButton",
);

/** NOTE: Vanilla prop types are a best-guess currently... */
export interface ButtonBadgeProps {
  children?: ReactNode;
}

/**
 * Button badge (with number)
 *
 * Requires coloring via styles.
 */
const ButtonBadge: FC<ButtonBadgeProps> = getModule(
  "game-ui/game/components/toolbar/components/number-badge/number-badge.tsx",
  "ButtonBadge",
);

/** Manually exported/bound modules that are not exported directly by CS2; use with caution! */
export default {
  components: {
    ButtonBadge,
    DescriptionTooltip,
    ToolButton,
  },
  common: {
    focus: {
      auto: getModule("game-ui/common/focus/focus-key.ts", "FOCUS_AUTO"),
      disabled: getModule("game-ui/common/focus/focus-key.ts", "FOCUS_DISABLED"),
    },
  },
};
