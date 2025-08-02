import { View, Text, StyleSheet, TouchableOpacity, Modal, Button, TouchableWithoutFeedback, Alert, } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { useState } from "react";
import { useUserStore } from "@/src/modules/shared/store/userStore";
import { toString } from "@/src/modules/shared/utils/UTCDateAtMidnight";
import { useDeleteUserViewModel, useLogoutViewModel } from "@/src/modules/user/form/viewmodel/authViewModel";

export default function ProfilePage() {
  const router = useRouter();
  const {user} = useUserStore();
  const [userInfoVisible, setUserInfoVisible] = useState(false);
  const {logout} = useLogoutViewModel();
  const {deleteUser} = useDeleteUserViewModel();
  const [isDeleteClicked, setisDeleteClicked] = useState(false);

  const handleSettingsPress = () => {
    router.push("/settings/settings");
  };

  const handleUserInfoPress = ()=>{
    setUserInfoVisible(true);
  }

  const handleLogoutPress = () => {
    logout();
  }

  const handleDeleteUserPress = () => {
    setisDeleteClicked(true);
    Alert.alert("회원탈퇴", "정말 회원탈퇴하시겠습니까?", [
      {text: "취소", onPress: () => {
        setisDeleteClicked(false);
      }},
      {text: "회원탈퇴", onPress: () => {
        deleteUser();
        Alert.alert("회원탈퇴가 완료되었습니다.");
      }},
    ]);
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.userContainer}>

        <View style ={styles.welcomeContainer}>
          <View style={styles.userNameContainer}>
            <Text style={styles.greeting}>{`안녕하세요, ${user?.nickname}님`}</Text>
          </View>
        </View>

        <View style={styles.manageContainer}>
          <TouchableOpacity style={styles.manageBox} onPress={handleUserInfoPress}>
            <Text style={styles.manageText}>회원정보</Text>
          </TouchableOpacity>
        </View>

      </View>

      <Modal
        visible={userInfoVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setUserInfoVisible(false)} 
      >
        <TouchableWithoutFeedback onPress={() => setUserInfoVisible(false)}>
          <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalBox}>
              <View style={styles.modalCloseContainer}>
                <TouchableOpacity onPress={() => setUserInfoVisible(false)}>
                  <Ionicons name="close" size={24} color='grey' />
                </TouchableOpacity>
              </View>

              <Text style = {styles.modalTitle}>회원정보</Text>

              <View style = {styles.modalContent}>
                <TouchableOpacity style = {styles.modalTextContainer}>
                  <Text style={styles.modalTextLeft}>이름</Text>
                  <Text style={styles.modalTextRight}>{user?.nickname}</Text>
                  <Ionicons name="chevron-forward" size={16} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.modalTextContainer}>
                  <Text style={styles.modalTextLeft}>생년월일</Text>
                  <Text style={styles.modalTextRight}>{toString(user?.dateOfBirth)}</Text>
                  <Ionicons name="chevron-forward" size={16} color="grey" />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.modalTextContainer}>
                  <Text style={styles.modalTextLeft}>이메일 주소</Text>
                  <Text style={styles.modalTextRight}>{'shane5969@naver.com'.slice(0, 20)}</Text>
                  <Ionicons name="chevron-forward" size={16} color="grey" />
                </TouchableOpacity>

              </View>

              <View style={styles.userAcessContainer}>
                <TouchableOpacity style={styles.userAccessTouchable} onPress={handleLogoutPress}>
                  <Text style={styles.userAccessText}>로그아웃</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.userAccessTouchable} onPress={handleDeleteUserPress}>
                  <Text style={styles.userAccessText}>회원탈퇴</Text>
                </TouchableOpacity>
              </View>
            </View>
            </TouchableWithoutFeedback>
          </View>
        
        </TouchableWithoutFeedback>
      </Modal>


    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'rgba(252, 148, 83, 0.1)' ,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderRadius: 5 , 
    height: 60,
    backgroundColor: COLORS.background.white,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
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
  
  manageContainer:{
    flex:1,
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  manageBox: {
    flex: 1,
    borderColor: 'grey', // 테두리 색 (진한 오렌지)
    borderWidth: 1,
    borderRadius: 9,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  manageText:{
    color: 'grey', // 오렌지색 (100% 불투명도)
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    paddingBottom: 30,
  },
  modalCloseContainer :{
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%', 
  },
  modalTitle:{
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContent:{
    width: "100%",
    marginTop: 32,
  },
  modalTextContainer:{
    flexDirection: 'row',     // 🔹 좌우 배치
    justifyContent: 'space-between', // 간격 조정 (기타: 'center', 'flex-start', 'flex-end')
    alignItems: 'center',     // 세로 정렬
    marginBottom: 30,
  },
  modalTextLeft: {
    flex: 1,
    fontSize: 15,
  },
  modalTextRight: {
    flex: 2,
    marginRight:4,
    textAlign: 'right',
    fontSize: 15,
  },
  modalCloseButton: {
    borderColor : 'rgba(250, 134, 67, 1)',
    borderWidth: 1,
    width: 50,
    height: 30,
    fontSize: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  modalCloseButtonText: {
    color: 'rgba(250, 134, 67, 1)', // 또는 대비되는 색
    fontSize: 16,
  },
  userAcessContainer:{
    paddingTop: 10,
    flexDirection: 'row',
    width:'100%',
    justifyContent: 'space-between',
    paddingHorizontal: '25%'
  },
  userAccessTouchable:{
    alignItems: 'center',
  },
  userAccessText:{
    color: 'grey',
  }
});
