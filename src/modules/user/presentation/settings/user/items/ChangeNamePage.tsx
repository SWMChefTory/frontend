import TextInputTemplate from "@/src/shared/components/textInputs/TextInputTemplate";
import { useState } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import {
  useChangeNameViewModel,
  useUserViewModel,
} from "@/src/modules/user/business/service/useUserSerivce";
import { userSchema } from "@/src/modules/user/business/validation/userSchema";

export default function ChangeNamePage() {
  const user = useUserViewModel();
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);
  const [nicknameChanged, setNicknameChanged] = useState(
    user?.nickname || "erorr"
  );
  const { changeNickname, isLoading } = useChangeNameViewModel();

  if (!user) {
    throw new Error("Protected route accessed without authenticated user");
  }

  const handlePressNickNameButton = () => {
    const result = userSchema
      .pick({ nickname: true })
      .safeParse({ nicknameChanged });
    if (!result.success) {
      changeNickname(nicknameChanged);
    }
  };

  const handlePressKeyBoard = () => {
    changeNickname(nicknameChanged);
    const result = userSchema
      .pick({ nickname: true })
      .safeParse({ nicknameChanged });
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
