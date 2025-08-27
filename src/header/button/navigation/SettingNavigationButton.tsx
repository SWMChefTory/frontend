import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function SettingNavigationButton() {
  const router = useRouter();
  const handleSettingPress = () => {
    router.push("/settings/settings");
  };
  return (
    <TouchableOpacity onPress={handleSettingPress}>
      <Ionicons name="settings-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}
