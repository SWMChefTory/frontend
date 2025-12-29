import { StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

//todo constant 옮기기
export const errorStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background.white,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text.black,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 14,
    color: COLORS.text.gray,
    marginBottom: 12,
    textAlign: "center",
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: COLORS.background.orange,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    backgroundColor: COLORS.background.gray,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },
});
