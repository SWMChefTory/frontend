import { HeaderTemplate } from "./template/HeaderTemplate";
import { useRouter } from "expo-router";
import {View } from "react-native";
import { HomeHeader } from "../banner/HomeBanner";
import SettingNavigationButton from "./button/navigation/SettingNavigationButton";
import NotificationNavigationButton from "./button/navigation/NotificationNavigationButton";

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
          <NotificationNavigationButton />
          <SettingNavigationButton />
        </View>
      }
    />
  );
}
