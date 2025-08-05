import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { CustomBackButton } from "@/src/modules/shared/components/layout/CustomBackButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title: string;
};

export default function OnlyBackHeader({ title }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container,{ paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        <View style={styles.leftSection}>
          <CustomBackButton />
        </View>
        <View style={styles.centerSection}>
          <Text style={styles.title}>{title}</Text>
        </View>
        <View style={styles.rightSection}>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // alignItems: "center",
    // height: 44, // iOS 표준 헤더 높이
    backgroundColor: "#ffffff",
    // paddingHorizontal: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  leftSection: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerSection: {
    flex: 2,
    alignItems: "center",
  },
  rightSection: {
    flex: 1,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
  },
});