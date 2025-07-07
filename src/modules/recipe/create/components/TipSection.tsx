import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  tipText: string;
}

export function TipSection({ tipText }: Props) {
  return (
    <View style={styles.tipContainer}>
      <Text style={styles.tipText}>{tipText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tipContainer: {
    alignItems: "center",
  },
  tipText: {
    fontSize: 14,
    color: "#64748B",
    fontStyle: "italic",
    fontWeight: "500",
    textAlign: "center",
  },
});
