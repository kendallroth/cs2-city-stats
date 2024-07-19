import { useValue } from "cs2/api";
import { game, tool } from "cs2/bindings";

/** High-level game information */
export const useGameInfo = () => {
  // Source: https://github.com/JadHajjar/FindIt-CSII/blob/main/FindIt/UI/src/mods/MainContainer/MainContainer.tsx
  const inPhotoMode = useValue(game.activeGamePanel$)?.__Type === game.GamePanelType.PhotoMode;
  const inEditor = useValue(tool.isEditor$);

  return {
    inEditor,
    inPhotoMode,
  };
};
