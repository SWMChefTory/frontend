import { Platform, View } from "react-native";
import Modal from "react-native-modal";
import Timer from "@/src/widgets/timer/components/Timer";

export default function RandscapeTimer({
  handleClose,
  recipeId,
  recipeTitle,
}: {
  handleClose: () => void;
  recipeId: string;
  recipeTitle: string;
}) {
  return (
    <Modal
      isVisible={true}
      onBackdropPress={handleClose}
      animationIn="slideInRight" // ← 오른쪽에서 슬라이드 인
      animationOut="slideOutRight" // ← 오른쪽으로 슬라이드 아웃
      style={{
        margin: 0,
        alignItems: "flex-end",
        ...(Platform.OS === "android" && { elevation: 999 }),
      }}
      backdropOpacity={0.5}
      useNativeDriver={true} // 성능 향상
      hideModalContentWhileAnimating={true}
    >
      <View
        style={{
          backgroundColor: "white",
          height: "100%",
          width: "36%",
          borderTopLeftRadius: 20,
          borderBottomLeftRadius: 20,
          paddingRight: 30,
          // padding: 20,
          ...(Platform.OS === "android" && { elevation: 999 }),
        }}
      >
      <Timer recipeId={recipeId} recipeTitle={recipeTitle} onClose={handleClose} />
      </View>
    </Modal>
  );
}