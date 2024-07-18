import { useValue } from "cs2/api";
import { game } from "cs2/bindings";

/** Multiple UI elements may react to photo mode in different ways */
export const usePhotoMode = () => {
  // Source: https://github.com/JadHajjar/FindIt-CSII/blob/main/FindIt/UI/src/mods/MainContainer/MainContainer.tsx
  const inPhotoMode = useValue(game.activeGamePanel$)?.__Type === game.GamePanelType.PhotoMode;

  return {
    active: inPhotoMode,
  };
};
