import { TouchableOpacity } from "react-native";

import { View } from "react-native";
import { HeaderTemplate } from "./template/HeaderTemplate";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function CollectionHeader() {
  const router = useRouter();
  const handleSettingPress = () => {
    router.push("/settings/settings");
  };

  return (
    <HeaderTemplate
      title=""
      leftComponent={<></>}
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
