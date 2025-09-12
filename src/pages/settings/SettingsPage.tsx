import { View, StyleSheet } from "react-native";
import UserFeatureItems from "@/src/pages/settings/user/UserFeatureItems";
import AuthActions from "@/src/pages/settings/auth/AuthActions";

export default function SettingsPage() {
  return (
    <View style={styles.container}>
      <UserFeatureItems />
      <AuthActions/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
});
