import { COLORS } from "@/src/modules/shared/constants/colors";
import { responsiveHeight } from "@/src/modules/shared/utils/responsiveUI";
import { responsiveWidth } from "@/src/modules/shared/utils/responsiveUI";
import { View, StyleSheet } from "react-native";
import { Pressable } from "react-native";
import { Text } from "react-native";
import { ActivityIndicator } from "react-native";

export function BottomSheetButton({ handleDismiss, isDisabled, onPress, isLoading, buttonLabel }: { handleDismiss: () => void, isDisabled: boolean, onPress: () => void, isLoading: boolean, buttonLabel: string }) {
  return (
        <View style={styles.btnRow}>
          <Pressable style={[styles.btn, styles.btnSecondary]} onPress={handleDismiss} disabled={isDisabled}>
            <Text style={styles.btnSecondaryText}>닫기</Text>
          </Pressable>
          <Pressable
            style={[styles.btn, isDisabled ? styles.btnDisabled : styles.btnPrimary]}
            onPress={onPress}
            disabled={isDisabled}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.text.white} />
            ) : (
              <Text style={styles.btnPrimaryText}>
                {buttonLabel}
              </Text>
            )}
          </Pressable>
        </View>
  )
}

const styles = StyleSheet.create({
    btnRow: { 
        flexDirection: "row", 
        gap: responsiveWidth(10), 
        marginTop: responsiveHeight(20) 
      },
      btn: { 
        flex: 1, 
        height: responsiveHeight(48), 
        borderRadius: 12, 
        alignItems: "center", 
        justifyContent: "center" 
      },
      btnSecondary: { 
        borderWidth: 1, 
        borderColor: COLORS.border.lightGray, 
        backgroundColor: COLORS.background.white 
      },
      btnPrimary: { 
        backgroundColor: COLORS.background.orange 
      },
      btnDisabled: { 
        backgroundColor: COLORS.background.gray 
      },
      btnPrimaryText: { 
        color: COLORS.text.white, 
        fontWeight: "700" 
      },
      btnSecondaryText: { 
        color: COLORS.text.gray, 
        fontWeight: "600" 
      },
    });