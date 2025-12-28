import { View, Modal } from "react-native";
import LottieView from "lottie-react-native";
import { useIsLoadingViewOpen } from "./LoadingViewStore";

export const WebviewLoadingView = () => {
  const {isLoadingViewOpen} = useIsLoadingViewOpen();

  if (!isLoadingViewOpen) return null;

  return (
    <Modal visible transparent animationType="none">
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <LottieView
          style={{ width: 140, height: 140 }}
          source={require("@/src/modules/shared/splash/loading/lottiefile/fullScreenLoader.json")}
          autoPlay
          loop
        />
      </View>
    </Modal>
  );
};
