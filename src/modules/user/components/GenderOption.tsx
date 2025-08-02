import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {
  Gender,
  getGenderLabel,
} from "@/src/modules/user/enums/Gender";
import { COLORS } from "@/src/modules/shared/constants/colors";

export const GenderOptions = ({
  selectedGender,
  setGender: setSeletedGender,
}: {
  selectedGender: Gender;
  setGender: (gender: Gender) => void;
}) => {
  return (
    <View style={styles.genderContainer}>
        {
          Object.keys(Gender).map((gender) => (
            <GenderOption
              key={gender}
              gender={gender as Gender}
              setGender={setSeletedGender}
              selectedGender={selectedGender}
            />
          ))
        }
    </View>
  );
};

const GenderOption = ({
  selectedGender,
  gender,
  setGender,
}: {
  gender: Gender;
  setGender: (gender: Gender) => void;
  selectedGender: Gender;
}) => (
  <TouchableOpacity
    style={[
      styles.genderButton,
      gender === selectedGender && styles.genderSelected,
    ]}
    onPress={() => setGender(gender)}
  >
    <Text
      style={[
        styles.genderText,
        gender === selectedGender && styles.genderTextSelected,
      ]}
    >
      {getGenderLabel(gender)}
    </Text>
  </TouchableOpacity>
);

// 추가 스타일
const styles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: "10%",
    padding: 10,
  },
  genderButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border.lightGray,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: COLORS.background.white,
    shadowColor: COLORS.shadow.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genderSelected: {
    backgroundColor: COLORS.orange.main,
    borderColor: COLORS.orange.main,
    shadowColor: COLORS.shadow.orange,
    shadowOpacity: 0.15,
  },
  genderText: {
    fontSize: 12,
    color: COLORS.text.black,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: COLORS.text.white,
    fontWeight: '600',
  },
});
