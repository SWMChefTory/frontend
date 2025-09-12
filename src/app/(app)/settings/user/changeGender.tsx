import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import ChangeGenderPage from "@/src/pages/change-gender/ChangeGenderPage";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function ChangeGender() {
  useEffect(() => {
    track.screen("ChangeGender");
  }, []);
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="" />,  
        }}
      />
      <ChangeGenderPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});
