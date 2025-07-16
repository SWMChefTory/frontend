import { useCallback, useRef } from "react";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { RecipeBottomSheet } from "@/src/modules/recipe/create/form/components/BottomSheet";

export function FloatingButton() {
  const modalRef = useRef<BottomSheetModal>(null);
  const router = useRouter();

  const openBottomSheet = useCallback(() => {
    modalRef.current?.present();
  }, []);

  const handleRecipeCreated = useCallback(
    (recipeId: string) => {
      router.push({
        pathname: "/recipe/create",
        params: { recipeId },
      });
    },
    [router],
  );

  return (
    <>
      <RecipeBottomSheet
        modalRef={modalRef}
        onRecipeCreated={handleRecipeCreated}
      />

      <View pointerEvents="box-none" style={styles.fabContainer}>
        <TouchableOpacity
          onPress={openBottomSheet}
          activeOpacity={0.8}
          style={styles.fab}
        >
          <View style={styles.fabInner}>
            <Text style={styles.fabText}>+</Text>
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  fabContainer: {
    position: "absolute",
    left: "50%",
    bottom: 45,
    transform: [{ translateX: -34 }],
    zIndex: 10,
  },
  fab: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FF4500",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 3,
    borderColor: "#FF6B35",
  },
  fabInner: {
    width: "100%",
    height: "100%",
    borderRadius: 31,
    backgroundColor: "#FF4500",
    justifyContent: "center",
    alignItems: "center",
  },
  fabText: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    textAlign: "center",
  },
});
