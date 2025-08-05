import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/src/modules/shared/constants/colors";

interface Props {
  onPress: () => void;
}

export function AddCategoryCard({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.addButtonGridItem} onPress={onPress}>
      <View style={styles.addButtonContent}>
        <Ionicons name="add" size={32} color={COLORS.text.white} />
        <Text style={styles.addButtonText}>카테고리{"\n"}추가</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  addButtonGridItem: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.orange.main,
    borderRadius: 12,
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonContent: {
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
  },
  addButtonText: {
    color: COLORS.text.white,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
});
