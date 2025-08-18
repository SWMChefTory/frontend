import { COLORS } from "@/src/modules/shared/constants/colors";
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
              <ActivityIndicator color="#FFF" />
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
        gap: 10, 
        marginTop: 20 
      },
      btn: { 
        flex: 1, 
        height: 48, 
        borderRadius: 12, 
        alignItems: "center", 
        justifyContent: "center" 
      },
      btnSecondary: { 
        borderWidth: 1, 
        borderColor: "#E5E7EB", 
        backgroundColor: "#FFF" 
      },
      btnPrimary: { 
        backgroundColor: COLORS.background.orange 
      },
      btnDisabled: { 
        backgroundColor: "#F3F4F6" 
      },
      btnPrimaryText: { 
        color: "#FFF", 
        fontWeight: "700" 
      },
      btnSecondaryText: { 
        color: "#374151", 
        fontWeight: "600" 
      },
    });