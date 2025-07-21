import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  Gender,
  getGenderLabel,
  getGenderIconName,
} from "@/src/modules/login/enums/Gender";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const optionValues = Object.values(Gender).map((gender) => {
  const g = gender as Gender;
  return {
    genderValue: g,
    label: getGenderLabel(g),
    icon: getGenderIconName(g) as IoniconsName,
  };
});

export const GenderOptions = ({
  genderSelected,
  setGender,
}: {
  genderSelected: Gender;
  setGender: (gender: Gender) => void;
}) => {
  console.log(optionValues);
  return (
    <View style={styles.genderContainer}>
      <Text style={styles.genderTitle}>성별 (선택사항)</Text>
      <View style={styles.genderOptions}>
        {optionValues.map((optionValue) => (
          <GenderOption
            key={optionValue.genderValue}
            {...optionValue}
            genderSelected={genderSelected}
            setGender={setGender}
          />
        ))}
      </View>
    </View>
  );
};

const GenderOption = ({
  genderSelected,
  setGender,
  genderValue,
  label,
  icon,
}: {
  genderSelected: Gender;
  setGender: (gender: Gender) => void;
  genderValue: Gender;
  label: string;
  icon: IoniconsName;
}) => (
  <TouchableOpacity
    style={[
      styles.genderCard,
      genderSelected === genderValue && styles.genderCardSelected,
    ]}
    onPress={() => setGender(genderValue)}
    activeOpacity={0.7}
  >
    <Ionicons
      name={icon}
      size={24}
      color={genderSelected === genderValue ? "#007AFF" : "#666"}
    />
    <Text
      style={[
        styles.genderCardText,
        genderSelected === genderValue && styles.genderCardTextSelected,
      ]}
    >
      {label}
    </Text>
    {genderSelected === genderValue && (
      <Ionicons name="checkmark-circle" size={20} color="#007AFF" />
    )}
  </TouchableOpacity>
);

// 추가 스타일
const styles = StyleSheet.create({
  genderContainer: {
    marginBottom: 24,
  },
  genderTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  genderOptions: {
    flexDirection: "row" as const, // 👈 타입 명시
    justifyContent: "space-between",
  },
  genderCard: {
    flex: 1,
    flexDirection: "column" as const, // 👈 타입 명시
    alignItems: "center",
    padding: 16,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  genderCardSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  genderCardText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
    marginTop: 8,
  },
  genderCardTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
});
