import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  visible: boolean;
  newCategoryName: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
  isCreating?: boolean;
}

export function AddCategoryModal({
  visible,
  newCategoryName,
  onChangeText,
  onCancel,
  onConfirm,
  isCreating = false,
}: Props) {
  // 애니메이션 값들
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 생성 중 애니메이션 처리
  useEffect(() => {
    if (isCreating) {
      // 모달 스케일 다운 및 오버레이 표시
      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // 지속적인 펄스 애니메이션
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 0.95,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
    } else {
      // 애니메이션 정리 및 원래 상태로 복귀
      pulseAnim.stopAnimation();

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
        Animated.spring(pulseAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 150,
          friction: 8,
        }),
      ]).start();
    }
  }, [isCreating]);

  const animatedModalStyle = {
    transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }],
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={isCreating ? undefined : onCancel} // 생성 중에는 뒤로 가기 비활성화
    >
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalContent, animatedModalStyle]}>
          {/* 메인 콘텐츠 */}
          <View
            style={[
              styles.contentContainer,
              isCreating && styles.creatingContent,
            ]}
          >
            <Text
              style={[styles.modalTitle, isCreating && styles.creatingTitle]}
            >
              {isCreating ? "카테고리 생성 중..." : "새 카테고리 추가"}
            </Text>

            <TextInput
              style={[styles.textInput, isCreating && styles.disabledInput]}
              placeholder="카테고리 이름을 입력하세요"
              value={newCategoryName}
              onChangeText={onChangeText}
              autoFocus={!isCreating}
              editable={!isCreating}
              selectTextOnFocus={!isCreating}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.cancelButton,
                  isCreating && styles.disabledButton,
                ]}
                onPress={onCancel}
                disabled={isCreating}
              >
                <Text
                  style={[
                    styles.cancelButtonText,
                    isCreating && styles.disabledButtonText,
                  ]}
                >
                  취소
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  isCreating && styles.creatingButton,
                ]}
                onPress={onConfirm}
                disabled={isCreating || !newCategoryName.trim()}
              >
                {isCreating ? (
                  <View style={styles.buttonContent}>
                    <ActivityIndicator
                      size="small"
                      color={COLORS.text.white}
                      style={{ marginRight: 8 }}
                    />
                    <Text style={styles.confirmButtonText}>생성 중...</Text>
                  </View>
                ) : (
                  <Text style={styles.confirmButtonText}>추가</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* 생성 중 오버레이 */}
          {isCreating && (
            <Animated.View
              style={[styles.loadingOverlay, { opacity: overlayOpacity }]}
            >
              <View style={styles.loadingContent}>
                <View style={styles.loadingIconContainer}>
                  <ActivityIndicator size="large" color={COLORS.orange.main} />
                  <Ionicons
                    name="folder-outline"
                    size={24}
                    color={COLORS.orange.main}
                    style={styles.folderIcon}
                  />
                </View>
                <Text style={styles.loadingText}>
                  새 카테고리를 생성하고 있습니다
                </Text>
                <Text style={styles.loadingSubText}>
                  잠시만 기다려주세요...
                </Text>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: COLORS.background.white,
    borderRadius: 16,
    width: "80%",
    maxWidth: 300,
    position: "relative",
    overflow: "hidden",
  },
  contentContainer: {
    padding: 24,
  },
  creatingContent: {
    opacity: 0.3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text.black,
    marginBottom: 20,
    textAlign: "center",
  },
  creatingTitle: {
    color: COLORS.orange.main,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: COLORS.background.white,
  },
  disabledInput: {
    backgroundColor: "#F8F8F8",
    borderColor: "#F0F0F0",
    color: COLORS.text.gray,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  cancelButton: {
    backgroundColor: "#F5F5F5",
  },
  confirmButton: {
    backgroundColor: COLORS.orange.main,
  },
  creatingButton: {
    backgroundColor: COLORS.orange.main,
    opacity: 0.8,
  },
  disabledButton: {
    backgroundColor: "#F0F0F0",
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: COLORS.text.gray,
    fontSize: 16,
    fontWeight: "500",
  },
  confirmButtonText: {
    color: COLORS.text.white,
    fontSize: 16,
    fontWeight: "500",
  },
  disabledButtonText: {
    color: "#C0C0C0",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  loadingContent: {
    alignItems: "center",
    padding: 20,
  },
  loadingIconContainer: {
    position: "relative",
    marginBottom: 16,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  folderIcon: {
    position: "absolute",
    opacity: 0.3,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.black,
    textAlign: "center",
    marginBottom: 4,
  },
  loadingSubText: {
    fontSize: 14,
    color: COLORS.text.gray,
    textAlign: "center",
  },
});
