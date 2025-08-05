import Settings from "@/src/modules/user/presentation/Settings";
import { Stack } from "expo-router";
import { View,StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import SettingsHeader from "@/src/header/SettingsHeader";

export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header: () => <SettingsHeader />,
          // animation: 'fade',
        }}
      />
      <Settings />
    </View>
  );
} 


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  }
});