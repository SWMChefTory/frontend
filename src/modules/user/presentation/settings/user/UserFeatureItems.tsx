import { View, Text, StyleSheet } from "react-native";
import UserFeatureItemTemplate from "@/src/modules/user/presentation/settings/user/items/_templates/UserFeatureItem";
import { useUserViewModel } from "@/src/modules/user/business/service/useUserSerivce";
import { router } from "expo-router";

export default function ProfilePage() {
  const user = useUserViewModel();

  if (!user) {
    return null;
  }

  return (
    <>
      <Text style={styles.title}>회원정보</Text>
      <View style={styles.content}>
        <UserFeatureItemTemplate
          title="이름"
          value={user.nickname}
          action={() => router.push("/settings/changeName")}
        />
        <UserFeatureItemTemplate
          title="생년월일"
          value={user.dateOfBirth?.toJSON() ?? "선택 안함"}
          action={() => router.push("/settings/changeDateOfBirth")}
        />
        <UserFeatureItemTemplate
          title="성별"
          value={user.gender ?? "선택 안함"}
          action={() => router.push("/settings/changeGender")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    color: "gray",
  },
  content: {
    width: "100%",
    marginTop: 20,
  },
});
