import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { Greeting } from "@/src/modules/shared/splash/greeting/lottieview/Greeting";

export default function ProfilePage() {
  const router = useRouter();

  const handleSettingsPress = () => {
    router.push("/settings/settings");
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <View style ={styles.welcomeContainer}>
          <Greeting/>
          <View style={styles.userNameContainer}>
            <Text style={styles.greeting}>{"안녕하세요, 클로이님"}</Text>
          </View>
        </View>
        <View style={styles.manageContainer}>
          <Text>관리</Text>
        </View>
      </View>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: COLORS.background.white,
    borderRadius: 12,
    marginHorizontal: 24,
    marginBottom: 24,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    gap: 20,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
  },
  profileSection: {
    alignItems: "flex-start",
    marginTop: -48,
    paddingHorizontal: 40,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    width: 98,
    height: 98,
    borderRadius: 49,
    backgroundColor: COLORS.background.gray,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 30,
  },
  userNameContainer: {
    flexDirection: "row",
    gap: 0,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 6
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
  },
  greeting: {
    fontSize: 22,
    color: COLORS.text.black,
    fontWeight: "bold",
  },
  manageContainer: {
    flex: 1
  },
  recipeSectionCard: {
    backgroundColor: COLORS.background.white,
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: COLORS.shadow.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
});
