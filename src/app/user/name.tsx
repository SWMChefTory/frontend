import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import {
  useChangeNameViewModel,
  useUserViewModel,
} from "@/src/modules/user/form/viewmodel/userViewModel";
import { router } from "expo-router";

function NameScreen() {
  const user = useUserViewModel();
  const { changeNickname, isLoading } = useChangeNameViewModel();
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [error, setError] = useState("");

  const handleNicknameChange = (text: string) => {
    setNickname(text);
    setError(""); // 입력 시 에러 메시지 제거
  };

  const validateNickname = () => {
    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return false;
    }
    if (nickname.trim().length < 2) {
      setError("닉네임은 2글자 이상 입력해주세요.");
      return false;
    }
    if (nickname.trim().length > 10) {
      setError("닉네임은 10글자 이하로 입력해주세요.");
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (!validateNickname()) return;

    changeNickname(nickname.trim(), {
      onSuccess: () => {
        Alert.alert("성공", "닉네임이 변경되었습니다!", [
          { text: "확인", onPress: () => router.back() },
        ]);
      },
      onError: (error: any) => {
        setError(error.message || "닉네임 변경에 실패했습니다.");
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* 헤더 섹션 */}
          <View style={styles.header}>
            <Text style={styles.title}>닉네임 설정</Text>
            <Text style={styles.subtitle}>
              다른 사용자들에게 보여질 이름을 설정해주세요
            </Text>
          </View>

          {/* 입력 섹션 */}
          <View style={styles.inputSection}>
            <Text style={styles.label}>닉네임</Text>
            <TextInput
              style={[
                styles.textInput,
                error ? styles.textInputError : {},
                nickname.trim().length > 0 ? styles.textInputFilled : {},
              ]}
              value={nickname}
              onChangeText={handleNicknameChange}
              placeholder="닉네임을 입력해주세요"
              placeholderTextColor={COLORS.text.gray}
              maxLength={10}
              autoFocus
              editable={!isLoading}
            />

            {/* 글자 수 표시 */}
            <View style={styles.characterCount}>
              <Text style={styles.characterCountText}>
                {nickname.length}/10
              </Text>
            </View>

            {/* 에러 메시지 */}
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          {/* 현재 닉네임 표시 */}
          {user?.nickname && (
            <View style={styles.currentSection}>
              <Text style={styles.currentLabel}>현재 닉네임</Text>
              <Text style={styles.currentValue}>{user.nickname}</Text>
            </View>
          )}
        </ScrollView>

        {/* 저장 버튼 */}
        <View style={styles.bottomSection}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!nickname.trim() || isLoading) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!nickname.trim() || isLoading}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.saveButtonText,
                (!nickname.trim() || isLoading) &&
                  styles.saveButtonTextDisabled,
              ]}
            >
              {isLoading ? "저장 중..." : "저장하기"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },

  // 헤더 스타일
  header: {
    marginBottom: 40,
  },
  title: {
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.text.black,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 16,
    color: COLORS.text.gray,
    lineHeight: 24,
  },

  // 입력 섹션 스타일
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.black,
    marginBottom: 12,
  },
  textInput: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 16,
    color: COLORS.text.black,
    backgroundColor: COLORS.background.white,
    borderWidth: 2,
    borderColor: COLORS.border.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 52,
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  textInputFilled: {
    borderColor: COLORS.orange.main,
    shadowOpacity: 0.1,
  },
  textInputError: {
    borderColor: COLORS.error.red,
  },
  characterCount: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  characterCountText: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 12,
    color: COLORS.text.gray,
  },
  errorText: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 14,
    color: COLORS.error.red,
    marginTop: 8,
  },

  // 현재 닉네임 섹션
  currentSection: {
    backgroundColor: COLORS.background.secondaryLightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  currentLabel: {
    fontFamily: "NotoSerifKR_400Regular",
    fontSize: 12,
    color: COLORS.text.gray,
    marginBottom: 4,
  },
  currentValue: {
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: 16,
    color: COLORS.text.black,
  },

  // 하단 버튼 섹션
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
  },
  saveButton: {
    backgroundColor: COLORS.orange.main,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: COLORS.shadow.orange,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.background.lightGray,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    fontFamily: "NotoSerifKR_700Bold",
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.white,
  },
  saveButtonTextDisabled: {
    color: COLORS.text.gray,
  },
});

export default NameScreen;
