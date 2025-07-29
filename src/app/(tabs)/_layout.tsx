import { Tabs } from "expo-router";
import { HomeHeader } from "@/src/modules/shared/components/header/HomeHeader";
import { FloatingButton } from "@/src/modules/shared/components/layout/FloatingButton";
import { CheftoryHeader } from "@/src/modules/shared/components/header/CheftoryHeader";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity } from "react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          sceneStyle: { backgroundColor: "#F8FAFC" },
          tabBarStyle: {
            height: 80,
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
          tabBarActiveTintColor: "#FF4500",
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
                  <View style={{ flexDirection: 'row', gap: 12, marginRight: 16 }}>
                    <TouchableOpacity>
                      <Ionicons name="notifications-outline" size={24} color="#000" />
                    </TouchableOpacity>
                  </View>
                }
              />
              ),
              tabBarLabel: "홈",
            }}
          />
        <Tabs.Screen
          name="profile"
          options={{
            headerTitle: "프로필",
            tabBarLabel: "마이",
          }}
        />
      </Tabs>
      <FloatingButton />
    </>
  );
}
