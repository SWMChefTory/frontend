import { View } from "react-native";
import { HeaderTemplate } from "./template/HeaderTemplate";
import { useRouter } from "expo-router";
import { HomeHeader } from "../banner/HomeBanner";
import NotificationNavigationButton from "./button/navigation/NotificationNavigationButton";
import SettingNavigationButton from "./button/navigation/SettingNavigationButton";

export default function CollectionHeader() {
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
          <NotificationNavigationButton />
          <SettingNavigationButton />
        </View>
      }
    />
  );
}
