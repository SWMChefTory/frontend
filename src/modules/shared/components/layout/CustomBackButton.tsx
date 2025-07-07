import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onPress?: () => void;
};

export function CustomBackButton({ onPress }: Props) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={{ paddingHorizontal: 12 }}
      onPress={onPress ? onPress : () => router.back()}
    >
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  );
}
