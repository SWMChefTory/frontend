import TextInputTemplate from "@/src/shared/components/textInputs/TextInputTemplate";
import { useState } from "react";
import { Alert, View } from "react-native";
import { Text } from "react-native-paper";
import {
  useChangeUserViewModel,
  useUserViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
import { userSchema } from "@/src/modules/user/business/validation/userSchema";
import { useRouter } from "expo-router";

export default function ChangeNicknamePage() {
  const user = useUserViewModel();
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [nicknameChanged, setNicknameChanged] = useState(
    user?.nickname || "error"
  );
  const { changeUser, isLoading } = useChangeUserViewModel();
  console.log("isLoading", isLoading);

  const router = useRouter();

  if (!user) {
    throw new Error("Protected route accessed without authenticated user");
  }

  const handlePressNickNameButton = async () => {
    const result = userSchema
      .pick({ nickname: true })
      .safeParse({ nickname: nicknameChanged });
    if (result.success) {
      try {
        await changeUser(user.withNickname(nicknameChanged));
        router.back();
      } catch (e) {
        Alert.alert("에러", "닉네임 변경에 실패했습니다.");
      }
    }
  };

  const handlePressKeyBoard = (nicknameChanged: string) => {
    setNicknameChanged(nicknameChanged);
    const result = userSchema
      .pick({ nickname: true })
      .safeParse({ nickname: nicknameChanged });
    if (!result.success) {
      setIsNicknameValid(false);
    } else {
      setIsNicknameValid(true);
    }
  };

  return (
    <View style={{ width: "80%", height: "100%", alignSelf: "center" }}>
      <View style={{ height: 16 }} />
      <Text variant="titleLarge">닉네임을 입력해주세요.</Text>
      <View style={{ height: 32 }} />
      <TextInputTemplate
        label="닉네임"
        value={nicknameChanged}
        onChangeValue={handlePressKeyBoard}
        onPressButton={handlePressNickNameButton}
        isValid={isNicknameValid}
        isSubmittable={nicknameChanged !== user?.nickname}
      ></TextInputTemplate>
    </View>
  );
}
