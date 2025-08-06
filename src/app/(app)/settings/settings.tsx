import Settings from "@/src/modules/user/presentation/settings/Settings";
import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import OnlyBackTemplate from "@/src/header/template/OnlyBackTemplate";

export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          header : () => <OnlyBackTemplate  title="설정" />,  
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
  },
});
