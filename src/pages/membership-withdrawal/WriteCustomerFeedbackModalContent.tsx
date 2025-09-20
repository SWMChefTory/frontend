import { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import SquareButton from "@/src/shared/components/textInputs/SquareButtonTemplate";
import {
  BlockSpacing,
  BlockSpacingType,
} from "@/src/shared/components/spacings/Spacing";
import { RichEditor } from "react-native-pell-rich-editor";
import { IconButton, Text, useTheme } from "react-native-paper";
import { track } from "@/src/modules/shared/utils/analytics";

export default function WriteCustomerFeedbackModalContent({
  onClose,
  onSave,
  label,
}: {
  onClose: () => void;
  onSave: (content: string) => void;
  label: string;
}) {
  const richText = useRef<any>(null);
  const [content, setContent] = useState("");
  console.log(label);
  const theme = useTheme();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleSend = () => {
    track.event("membership_withdrawal_feedback_submitted", {
      label,
      content,
    });

    // 전송 완료 메시지 표시
    setShowSuccessMessage(true);

    // 애니메이션으로 메시지 나타내기
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // 1.5초 후 모달 닫기
    setTimeout(() => {
      onSave(content);
    }, 1500);
  };
  return (
    <BottomSheetView
      style={{
        overflow: "hidden",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 1,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "98%",
          alignSelf: "center",
          height: 70,
        }}
      >
        <View style={{ height: 70 }}>
          <IconButton
            icon="close-circle"
            size={32}
            onPress={onClose}
            iconColor="#666666" // 또는 "#888888" (아이콘 회색)
          />
        </View>
        <View style={{ height: 70, alignItems: "flex-end" }}>
          <IconButton
            icon="send-circle" 
            size={32}
            disabled={showSuccessMessage}
            onPress={() => {
              track.event("membership_withdrawal_feedback_submitted", {
                label,
                content,
              });
              handleSend();
            }}
            iconColor="#666666"
          />
          {showSuccessMessage && (
            <Animated.View
              style={{
                opacity: fadeAnim,
                alignItems: "center",
                marginTop: -8,
              }}
            >
              <Text
                variant="bodySmall"
                style={{
                  color: "#666666",
                  paddingRight: 5,
                }}
              >
                전송 완료
              </Text>
            </Animated.View>
          )}
        </View>
      </View>

      <ScrollView
        style={{
          width: "94%",
          alignSelf: "center",
        }}
      >
        <BlockSpacing type={BlockSpacingType.small} />
        <Text variant="titleLarge" style={{ paddingLeft: 10 }}>
          {label}
        </Text>
        <Text
          variant="bodyMedium"
          style={{ paddingLeft: 10, color: theme.colors.onSurfaceVariant }}
        >
          상세한 이유를 입력해주세요.
        </Text>
        <RichEditor
          ref={richText}
          onChange={setContent}
          disabled={showSuccessMessage}
          style={{
            flex: 1,
            paddingLeft: 0,
            paddingRight: 0,
            marginLeft: 0,
            marginRight: 0,
          }}
          placeholder="제목을 입력한 후 엔터를 치고 내용을 작성하세요"
        />
      </ScrollView>
    </BottomSheetView>
  );
}
