import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/src/modules/shared/context/auth/AuthContext";
import { COLORS } from "@/src/modules/shared/constants/colors";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSettingsPress = () => {
    router.push("/settings/settings");
  };

  return (
    <View style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Ionicons name="notifications-outline" size={28} color={COLORS.text.black} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSettingsPress}
        >
          <Ionicons name="settings-outline" size={28} color={COLORS.text.black} />
        </TouchableOpacity>
      </View>

      {/* 프로필 섹션 */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={38} color={COLORS.text.white} />
          </View>
        </View>

        <View style={styles.textContainer}>
          <View style={styles.userNameContainer}>
            <Text style={styles.greeting}>{"안녕하세요 "}</Text>
            <Text style={styles.userName}>{user?.name || "클로이"}</Text>
            <Text style={styles.greeting}>{" 셰프님."}</Text>
          </View>
          <Text style={styles.greeting}>오늘도 즐거하세요 :)</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
    paddingTop: 55,
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
    gap: 4,
  },
  textContainer: {
    alignItems: "flex-start",
  },
  userName: {
    fontSize: 33,
    fontWeight: "bold",
    color: COLORS.text.black,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  greeting: {
    fontSize: 27,
    color: COLORS.text.gray,
    fontWeight: "400",
    lineHeight: 36,
  },
});
