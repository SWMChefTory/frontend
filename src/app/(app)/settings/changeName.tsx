import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeName from "@/src/modules/user/presentation/settings/ChangeName";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function ChangeNamePage() {
  useEffect(() => {
    track.screen("ChangeName");
  }, []);
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="이름 변경" />,  
        }}
      />
      <ChangeName />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});
