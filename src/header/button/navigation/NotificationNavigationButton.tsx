import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function NotificationNavigationButton() {
  const router = useRouter();
  const handleNotificationPress = () => {
    router.push("/notification/notification");
  };
  return (
    <TouchableOpacity onPress = {handleNotificationPress}>
      <Ionicons name="notifications-outline" size={24} color="#000" />
    </TouchableOpacity>
  );
}
