import { Platform } from "react-native";
import { COLORS } from "./colors";

export const SHADOW = {
  ...(Platform.OS === "ios"
    ? {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: COLORS.border.white,
      }
    : {
        borderWidth: 2,
        borderColor: COLORS.border.lightGray,
      }),
};

export const SKELETON_SHADOW = {
  ...(Platform.OS === "ios"
    ? {
        shadowColor: COLORS.shadow.orange,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      }
    : {
        borderWidth: 2,
        borderColor: COLORS.border.orange,
      }),
};
