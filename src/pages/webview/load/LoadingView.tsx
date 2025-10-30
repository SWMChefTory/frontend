import { View,  Modal } from "react-native";
import LottieView from "lottie-react-native";

export const WebviewLoadingView = () => {
  return (
    <Modal visible transparent animationType="none">
      <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
        <LottieView
          style={{
            width: 140,
            height: 140,
          }}
          source={require("@/src/modules/shared/splash/loading/lottiefile/fullScreenLoader.json")}
          autoPlay
          loop={true}
        />
      </View>
    </Modal>
  );
};
