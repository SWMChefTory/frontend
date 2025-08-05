import { View, StyleSheet, Alert } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import {
  useDeleteUserViewModel,
  useLogoutViewModel,
} from "@/src/modules/user/business/service/useAuthService";
import AuthActionTemplate from "./AuthActionTemplate";

export default function AuthActions() {
  const { logout, completeLogout } = useLogoutViewModel();
  const { deleteUser } = useDeleteUserViewModel();

  const handleLogoutPress = () => {
    Alert.alert("로그아웃", "정말 로그아웃 하시겠습니까?", [
      { text: "취소", onPress: () => {} },
      {
        text: "로그아웃",
        onPress: () => {
          logout();
          Alert.alert(
            "로그아웃이 완료되었습니다.",
            "로그인 화면으로 이동합니다.",
            [
              {
                text: "확인",
                onPress: () => {
                  completeLogout();
                },
              },
            ],
          );
        },
      },
    ]);
  };

  const handleDeleteUserPress = () => {
    Alert.alert("회원탈퇴", "정말 회원탈퇴하시겠습니까?", [
      { text: "취소", onPress: () => {} },
      {
        text: "회원탈퇴",
        onPress: () => {
          deleteUser();
          Alert.alert("회원탈퇴가 완료되었습니다.");
        },
      },
    ]);
  };

  return (
    <View style={styles.userAcessContainer}>
      <AuthActionTemplate
        authAction={handleLogoutPress}
        actionName="로그아웃"
      />
      <AuthActionTemplate
        authAction={handleDeleteUserPress}
        actionName="회원탈퇴"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: "rgba(252, 148, 83, 0.1)",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 15,
    gap: 20,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    borderRadius: 5,
    height: 60,
    backgroundColor: COLORS.background.white,
  },
  welcomeContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    flex: 5,
  },
  userNameContainer: {
    flexDirection: "row",
    paddingLeft: 10,
  },
  greeting: {
    fontSize: 18,
    color: COLORS.text.black,
    fontWeight: "bold",
  },

  manageContainer: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  manageBox: {
    flex: 1,
    borderColor: "grey", // 테두리 색 (진한 오렌지)
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  manageText: {
    color: "grey", // 오렌지색 (100% 불투명도)
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    paddingBottom: 30,
  },
  modalCloseContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContent: {
    width: "100%",
    marginTop: 32,
  },
  modalTextContainer: {
    flexDirection: "row", // 🔹 좌우 배치
    justifyContent: "space-between", // 간격 조정 (기타: 'center', 'flex-start', 'flex-end')
    alignItems: "center", // 세로 정렬
    marginBottom: 30,
  },
  modalTextLeft: {
    flex: 1,
    fontSize: 15,
  },
  modalTextRight: {
    flex: 2,
    marginRight: 4,
    textAlign: "right",
    fontSize: 15,
  },
  modalCloseButton: {
    borderColor: "rgba(250, 134, 67, 1)",
    borderWidth: 1,
    width: 50,
    height: 30,
    fontSize: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  modalCloseButtonText: {
    color: "rgba(250, 134, 67, 1)", // 또는 대비되는 색
    fontSize: 16,
  },
  userAcessContainer: {
    paddingTop: 10,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: "25%",
  },
  userAccessTouchable: {
    alignItems: "center",
  },
  userAccessText: {
    color: "grey",
  },
});
