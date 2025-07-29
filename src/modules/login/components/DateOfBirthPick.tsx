import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { makeUTCDateAtMidnight, UTCDateAtMidnight } from "@/src/modules/shared/utils/auth/UTCDateAtMidnight";
import { COLORS } from "../../shared/constants/colors";

const years = Array.from({ length: 100 }, (_, i) => (2025 - i));
const months = Array.from({ length: 12 }, (_, i) => i + 1 
);
const days = Array.from({ length: 31 }, (_, i) => i + 1
);

export const DateOfBirthPick = ({dateOfBirth, setDateOfBirth}: {dateOfBirth: UTCDateAtMidnight, setDateOfBirth: (date: UTCDateAtMidnight) => void}) => {
  return(
    <View style={styles.birthContainer}>
      <View style={styles.yearPickerWrapper}>
        <Picker
          selectedValue={dateOfBirth.getFullYear()}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(itemValue) => setDateOfBirth(makeUTCDateAtMidnight(itemValue, dateOfBirth.getMonth(), dateOfBirth.getDate()))}
        >
          {years.map((y) => (
            <Picker.Item key={y} label={`${y}년`} value={y} />
          ))}
        </Picker>
      </View>
    
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={dateOfBirth.getMonth()}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(itemValue) => setDateOfBirth(makeUTCDateAtMidnight(dateOfBirth.getFullYear(), itemValue + 1,dateOfBirth.getDate()))}
        >
          {months.map((m) => (
            <Picker.Item key={m} label={`${m}월`} value={m} />
          ))}
        </Picker>
      </View>
    
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={dateOfBirth.getDate()}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(itemValue) => setDateOfBirth(makeUTCDateAtMidnight(dateOfBirth.getFullYear(), dateOfBirth.getMonth(), itemValue))}
        >
          {days.map((d) => (
            <Picker.Item key={d} label={`${d}일`} value={d} />
          ))}
        </Picker>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  birthInputSection: {
    marginTop: 10,
  },
  birthContainer: {
    flexDirection: 'row',
    gap: 8,
    borderRadius: 12,
    padding : 4  ,
    height: 150,
  },

  yearPickerWrapper: {
    flex: 1.3,
    height: 160,
    overflow: 'hidden',
    backgroundColor: COLORS.background.white,
    borderRadius: 8,
  },
  pickerWrapper: {
    flex: 1,
    height: 160,
    overflow: 'hidden',
    backgroundColor: COLORS.background.white,
    borderRadius: 8,
  },
  picker: {
    flex: 1,
    marginTop: 0,
    paddingTop: 0,
  },
  pickerItem: {
    fontSize: 12,
    height: 160,
    color: COLORS.text.black,
  },
})