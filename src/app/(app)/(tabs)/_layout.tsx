import {
  router,
  Tabs,
  useLocalSearchParams,
  Redirect,
  usePathname,
  useSegments,
} from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import { RecipeBottomSheet } from "@/src/modules/recipe/create/form/components/BottomSheet";
import IndexHeader from "@/src/header/IndexHeader";
import CollectionHeader from "@/src/header/CollectionHeader";
import { deepLinkActionStore } from "@/src/deepLinkActionStore";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SHADOW } from "@/src/modules/shared/constants/shadow";
import { track } from "@/src/modules/shared/utils/analytics";

export default function TabLayout() {
  const modalRef = useRef<BottomSheetModal>(null);
  console.log("TabLayout");
  const {deepLinkAction} = deepLinkActionStore();
  const [modalData, setModalData] = useState<string | null>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if(deepLinkAction?.actionType==='create'){
      openBottomSheet({youtubeUrl:deepLinkAction.params.youtubeUrl});

      return;
    }
}, [deepLinkAction]);     

  const openBottomSheet = useCallback(
    ({ youtubeUrl = "" }: { youtubeUrl: string }) => {
      track.event("open_create_bottom_sheet", {
        from: "tabs",
        youtubeUrl: youtubeUrl,
      });
      setModalData(youtubeUrl);
      modalRef.current?.present();
    },
    [],
  );

  return (
    <>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "#F8FAFC" },
          tabBarStyle: {
            height: 80 + insets.bottom,
            paddingHorizontal: 30,
            paddingBottom: insets.bottom,
            paddingTop: 8,
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            ...SHADOW,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
            marginTop: 4,
          },
          tabBarActiveTintColor: COLORS.font.dark,
          tabBarInactiveTintColor: "#9CA3AF",
          animation: "fade",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            header: () => <IndexHeader />,
            animation: "fade",
            tabBarLabel: "홈",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
            title: "홈",
          }}
        />
        <Tabs.Screen
          name="dummy"
          options={{
            tabBarButton: () => (
              <View style={style.container}>
                <RecipeBottomSheet
                  modalRef={modalRef}
                  youtubeUrl={modalData || ""}
                />
                <TouchableOpacity
                  onPress={() => openBottomSheet({ youtubeUrl: "" })}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={48}
                    color={"#543f30"}
                  />
                </TouchableOpacity>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="collection"
          options={{
            header: () => <CollectionHeader />,
            tabBarLabel: "컬렉션",
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="file-tray-stacked-outline"
                size={size}
                color={color}
              />
            ),
            title: "컬렉션",
          }}
        />
      </Tabs>
    </>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: COLORS.priamry.main,
    alignItems: "center",
    justifyContent: "center",
  },
});

// src/app/(app)/(tabs)/index.tsx
