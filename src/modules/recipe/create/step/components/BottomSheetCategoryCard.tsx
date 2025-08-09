import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  id: string;
  name: string;
  count?: number;
  selected: boolean;
  isCurrent?: boolean;
  onPress: (id: string) => void;
}

export function BottomSheetCategoryCard({ id, name, count, selected, isCurrent = false, onPress }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      style={[styles.container, selected ? styles.containerSelected : styles.containerUnselected]}
      activeOpacity={0.9}
    >
      <View style={[styles.iconContainer, selected ? styles.iconContainerSelected : styles.iconContainerDefault]}>
        <Ionicons
          name="folder"
          size={20}
          color={selected ? COLORS.text.white : COLORS.orange.main}
        />
      </View>
      <Text style={[styles.name, selected ? styles.nameSelected : styles.nameDefault]} numberOfLines={1}>
        {name}
      </Text>
      {typeof count === "number" && (
        <Text style={[styles.count, selected ? styles.countSelected : styles.countDefault]}>{count}개</Text>
      )}
      {isCurrent && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>현재</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 92,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: COLORS.background.white,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  containerUnselected: {
    borderColor: COLORS.border.orangeLight,
  },
  containerSelected: {
    borderColor: COLORS.orange.main,
    backgroundColor: "#FFF7F3",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  iconContainerDefault: {
    backgroundColor: "#FFF3F0",
  },
  iconContainerSelected: {
    backgroundColor: COLORS.orange.main,
  },
  name: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 2,
    maxWidth: "100%",
  },
  nameDefault: {
    color: COLORS.text.black,
  },
  nameSelected: {
    color: COLORS.orange.main,
  },
  count: {
    fontSize: 10,
  },
  countDefault: {
    color: COLORS.text.gray,
  },
  countSelected: {
    color: COLORS.orange.main,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    color: "#6B7280",
    fontWeight: "600",
  },
});

export default BottomSheetCategoryCard;

