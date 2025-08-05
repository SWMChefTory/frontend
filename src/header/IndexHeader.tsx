import { HeaderTemplate } from "./template/HeaderTemplate";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { HomeHeader } from "./HomeHeader";

export default function IndexHeader() {
  const router = useRouter();
  const handleSettingPress = () => {
    router.push("/settings/settings");
  };

  return (
    <HeaderTemplate
      title=""
      leftComponent={<HomeHeader />}
      rightComponent={
        <View style={{ flexDirection: "row", gap: 12, marginRight: 16 }}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSettingPress}>
            <Ionicons name="settings-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      }
    />
  );
}
