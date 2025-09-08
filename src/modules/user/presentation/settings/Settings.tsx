import { View, StyleSheet } from "react-native";
import UserFeatureItems from "@/src/modules/user/presentation/settings/UserFeatureItems";
import AuthActions from "@/src/modules/user/presentation/settings/AuthActions";

export default function Settings() {
  return (
    <View style={styles.container}>
      {/* <UserFeatureItems />
      <AuthActions/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    // backgroundColor: 'rgba(252, 148, 83, 0.1)' ,
  },
});
