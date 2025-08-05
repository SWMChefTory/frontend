import LottieView from "lottie-react-native";
import {
  View,
  StyleSheet,
  Dimensions,
  StyleProp,
  ViewStyle,
} from "react-native";

export const Greeting = () => {
  return (
    <View>
      <LottieView
        style={{
          width: 50,
          height: 50,
        }}
        source={require("@/src/modules/shared/splash/greeting/lottilefile/greeting.json")}
        autoPlay
        loop={false}
      />
    </View>
  );
};
