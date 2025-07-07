import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";

interface Props {
  modalRef: React.RefObject<BottomSheetModal | null>;
  handleSubmit: (url: string) => void;
  loading: boolean;
}

export function RecipeBottomSheet({ modalRef, handleSubmit, loading }: Props) {
  const [videoUrl, setVideoUrl] = useState("");

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        onPress={() => modalRef.current?.dismiss()}
      />
    ),
    [modalRef],
  );

  return (
    <BottomSheetModal
      ref={modalRef}
      index={1}
      snapPoints={["30%", "50%"]}
      enablePanDownToClose={true}
      backgroundStyle={{
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      backdropComponent={renderBackdrop}
    >
      <BottomSheetView style={styles.sheetContainer}>
        <View style={styles.handleBar} />
        <View style={styles.statusDot} />
        <View style={styles.contentCard}>
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <Text style={styles.iconText}>✨</Text>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>AI 레시피 생성</Text>
              <Text style={styles.subtitle}>
                영상을 분석해서 레시피를 만들어드려요
              </Text>
            </View>
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>영상 링크</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.linkIcon}>🔗</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YouTube, Instagram 링크를 붙여넣으세요"
                placeholderTextColor="#9CA3AF"
                value={videoUrl}
                onChangeText={setVideoUrl}
                editable={!loading}
                keyboardType="url"
              />
            </View>
          </View>
          <TouchableOpacity
            style={styles.createButtonWrapper}
            activeOpacity={0.8}
            disabled={!videoUrl.trim()}
            onPress={() => {
              setVideoUrl("");
              handleSubmit(videoUrl);
            }}
          >
            <View
              style={[
                styles.createButton,
                !videoUrl.trim() && styles.createButtonDisabled,
              ]}
            >
              <Text style={styles.createButtonText}>
                {loading ? "🔄 생성중..." : "🚀 레시피 만들기"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingBottom: 0,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E7EB",
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  statusDot: {
    position: "absolute",
    top: 16,
    right: 20,
    width: 14,
    height: 14,
    backgroundColor: "#FF4500",
    borderRadius: 7,
    zIndex: 10,
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  contentCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 24,
    backgroundColor: "#FF6B35",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  iconText: {
    fontSize: 24,
    color: "#fff",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    lineHeight: 22,
  },
  inputCard: {
    backgroundColor: "#F9FAFB",
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 2,
    borderColor: "#F3F4F6",
  },
  linkIcon: {
    fontSize: 20,
    color: "#FF4500",
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "transparent",
  },
  createButtonWrapper: {
    marginTop: 8,
  },
  createButton: {
    backgroundColor: "#FF4500",
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  createButtonDisabled: {
    backgroundColor: "#E5E7EB",
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
});
