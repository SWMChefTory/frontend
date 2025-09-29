import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, View } from "react-native";
import { responsiveFontSize, responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import TimerControlSection from "@/src/widgets/timer/components/TimerControlSection"

type TimerFinishedProps = {
  onEnd: () => void;
};

export function TimerFinish({ onEnd }: TimerFinishedProps) {
  const data = {label : "재설정",icon : "replay",onPress : onEnd, isEmphasis : true, disabled : false}
  return (
    <View style={styles.container}>
      <TimerControlSection buttonsProps={[data]} width={"92%"}/>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
