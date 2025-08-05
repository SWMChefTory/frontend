import { View, StyleSheet, Dimensions, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";

export const FullScreenLoader = () => {
  return (
    <Modal visible transparent animationType="none">
      <View style={styles.overlay}>
        <LottieView
          style={{
            width: 100,
            height: 100,
          }}
          source={require("@/src/modules/shared/splash/loading/lottiefile/fullScreenLoader.json")}
          autoPlay
          loop={true}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: COLORS.priamry.cook, // 약간 어두운 배경으로 클릭 방지 시각화
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000, // 다른 컴포넌트 위에 표시
  },
  lottie: {
    width: 120,
    height: 120,
  },
});
