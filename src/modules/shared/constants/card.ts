import { COLORS } from "./colors";

export const CARD_STYLES = {
    small: {
      backgroundColor: COLORS.background.white,
      borderRadius: 8,
      paddingBottom: 12,
    },
    medium_horizontal: {
      width: 220,
      height: 220,
      backgroundColor: COLORS.background.white,
      borderRadius: 16,
      paddingBottom: 12,
    },
      medium_vertical: {
      width: 400,
      aspectRatio: 1,
      backgroundColor: COLORS.background.white,
      borderRadius: 16,
      paddingBottom: 12,
    },
    large: {
      backgroundColor: COLORS.background.white,
      paddingBottom: 12,
    },
  } as const;