import { View, StyleSheet } from "react-native";
import UserFeatureItems from "@/src/modules/user/presentation/settings/user/UserFeatureItems";
import AuthActions from "@/src/modules/user/presentation/settings/auth/AuthActions";

export default function Settings() {
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
