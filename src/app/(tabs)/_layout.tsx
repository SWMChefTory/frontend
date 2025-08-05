import { Tabs } from "expo-router";
import { HomeHeader } from "@/src/modules/shared/components/header/HomeHeader";
import { FloatingButton } from "@/src/modules/shared/components/layout/FloatingButton";
import { CheftoryHeader } from "@/src/modules/shared/components/header/CheftoryHeader";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "@/src/modules/shared/constants/colors";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useRef } from "react";
import { RecipeBottomSheet } from "@/src/modules/recipe/create/form/components/BottomSheet";

export default function TabLayout() {
  const modalRef = useRef<BottomSheetModal>(null);

  const openBottomSheet = useCallback(() => {
    modalRef.current?.present();
  }, []);

  return (
    <>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "#F8FAFC" },
          tabBarStyle: {
            height: 80,
            paddingHorizontal: 30,
            paddingBottom: 12,
            paddingTop: 8,
            backgroundColor: "#ffffff",
            borderTopWidth: 0,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 10,
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
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            header: () => (
              <CheftoryHeader
                title=""
                leftComponent={<HomeHeader />}
                rightComponent={
                  <View
                    style={{ flexDirection: "row", gap: 12, marginRight: 16 }}
                  >
                    <TouchableOpacity>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                }
              />
            ),
            tabBarLabel: "홈",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dummy"
          options={{
            tabBarButton: () => (
              <View style={style.container}>
                <RecipeBottomSheet modalRef={modalRef} />
                <TouchableOpacity onPress={openBottomSheet} activeOpacity={0.8}>
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
          name="profile"
          options={{
            header: () => (
              <CheftoryHeader
                title=""
                leftComponent={<></>}
                rightComponent={
                  <View
                    style={{ flexDirection: "row", gap: 12, marginRight: 16 }}
                  >
                    <TouchableOpacity>
                      <Ionicons
                        name="notifications-outline"
                        size={24}
                        color="#000"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons
                        name="settings-outline"
                        size={24}
                        color="#000"
                      />
                    </TouchableOpacity>
                  </View>
                }
              />
            ),
            tabBarLabel: "마이",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
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
