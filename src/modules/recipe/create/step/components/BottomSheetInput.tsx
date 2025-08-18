import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  onCancel: () => void;
  ref: React.RefObject<React.ComponentRef<typeof BottomSheetTextInput> | null>
}

export function BottomSheetInput({ value, onChangeText, onCancel, ref }: Props) {
    return (
      <View style={styles.container}>
        <BottomSheetTextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="예) 면 요리, 자주 먹는 것"
          style={[styles.input, styles.inputFocused]}
          ref={ref}
          autoCapitalize="none"
          autoCorrect={false}
          placeholderTextColor="#9AA0A6"
        />
        <Pressable style={styles.cancelCreate} onPress={onCancel}>
          <Text style={styles.cancelCreateText}>취소</Text>
        </Pressable>
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      position: 'relative',
      flex: 1,
    },
    input: {
      height: 44, 
      borderWidth: 1, 
      borderColor: "#E5E7EB", 
      borderRadius: 12,
      paddingHorizontal: 12,
      paddingRight: 60,
      backgroundColor: "#FFF", 
      fontSize: 14, 
      color: "#111827",
    },
    inputFocused: {
      borderColor: COLORS.background.orange,
      borderWidth: 2,
    },
    cancelCreate: {
      position: 'absolute',
      right: 8,
      top: 8,
      bottom: 8,
      justifyContent: 'center', 
      paddingHorizontal: 12,
    },
    cancelCreateText: {
      color: "#6B7280",
      fontSize: 14,
    },
  });