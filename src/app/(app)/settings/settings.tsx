import SettingsPage from "@/src/pages/settings/SettingsPage";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";
import { useEffect } from "react";
import { track } from "@/src/modules/shared/utils/analytics";

export default function Settings() {
  useEffect(() => {
    track.screen("Settings");
  }, []);
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="설정" />,  
          // animation: 'fade',
        }}
      />
      <SettingsPage />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
});
