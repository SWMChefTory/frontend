import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveFontSize } from "@/src/modules/shared/utils/responsiveUI";

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
          placeholderTextColor={COLORS.text.gray}
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
      height: responsiveHeight(44), 
      borderWidth: 1, 
      borderColor: COLORS.border.lightGray, 
      borderRadius: 12,
      paddingHorizontal: responsiveWidth(12),
      paddingRight: responsiveWidth(60),
      backgroundColor: COLORS.background.white, 
      fontSize: responsiveFontSize(14), 
      color: COLORS.text.black,
    },
    inputFocused: {
      borderColor: COLORS.background.orange,
      borderWidth: 2,
    },
    cancelCreate: {
      position: 'absolute',
      right: responsiveWidth(8),
      top: responsiveHeight(8),
      bottom: responsiveHeight(8),
      justifyContent: 'center', 
      paddingHorizontal: responsiveWidth(12),
    },
    cancelCreateText: {
      color: COLORS.text.gray,
      fontSize: responsiveFontSize(14),
    },
  });