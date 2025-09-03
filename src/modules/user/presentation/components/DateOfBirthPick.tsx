import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { DateTime } from "luxon";
import { COLORS } from "../../../shared/constants/colors";
import { DateOnly } from "@/src/modules/shared/utils/DateOnly";
// 월별 일수 계산 함수
const getDaysInMonth = (year: number, month: number): number[] => {
  const daysCount = DateTime.local(year, month).daysInMonth;
  return Array.from({ length: (DateTime.now().year === year && DateTime.now().month === month) ? DateTime.now().day : daysCount || 0 }, (_, i) => i + 1);
};

export const DateOfBirthPick = ({
  dateOfBirth,
  setDateOfBirth,
}: {
  dateOfBirth: DateOnly;
  setDateOfBirth: (date: DateOnly) => void;
}) => {
  // 현재 선택된 날짜에서 년, 월, 일 추출
  const now = DateTime.now();
  const nowYear = now.year;
  const nowMonth = now.month;
  const nowDay = now.day;

  const currentYear = dateOfBirth.dateOfBirth.year;
  const currentMonth = dateOfBirth.dateOfBirth.month;
  const currentDay = dateOfBirth.dateOfBirth.day;

  const years = Array.from({ length: 100 }, (_, i) => nowYear - i);
  
  const months = Array.from({ length: nowYear > currentYear ? 12 : nowMonth }, (_, i) => i + 1);
  // const months = dateOfBirth.dateOfBirth.year === currentYear ? Array.from({ length: 12 }, (_, i) => i + 1) : currentMonth;

  // 현재 선택된 년/월에 해당하는 일수 계산
  const availableDays = getDaysInMonth(currentYear, currentMonth);

  // 새로운 날짜로 DateOnly 생성
  const createNewDate = (
    year: number,
    month: number,
    day: number,
  ): DateOnly => {
    // 해당 월의 마지막 날보다 큰 일수가 선택된 경우 마지막 날로 조정
    const maxDay = DateTime.local(year, month).daysInMonth;
    const adjustedDay = Math.min(day, maxDay || 0);

    const newDateTime = DateTime.local(year, month, adjustedDay);
    const newDate = DateOnly.create(newDateTime.toISODate() || "");
    console.log("newDateTime", newDateTime.toISODate());
    console.log("newDate", newDate);
    if (newDate === null) {
      throw new Error("newDate is null");
    }

    return newDate;
  };

  return (
    <View style={styles.birthContainer}>
      {/* 연도 선택 */}
      <View style={styles.yearPickerWrapper}>
        <Picker
          selectedValue={currentYear}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(itemValue) => {
            let nextMonth = currentMonth;
            let nextDay = currentDay;
            if (itemValue === nowYear) {
              if (currentMonth > nowMonth) {
                if (currentDay > nowDay) {
                  nextDay = nowDay;
                }
                nextMonth = nowMonth;
              }
            }
            const newDate = createNewDate(itemValue, nextMonth, nextDay);
            setDateOfBirth(newDate);
          }}
        >
          {years.map((year) => (
            <Picker.Item key={year} label={`${year}년`} value={year} />
          ))}
        </Picker>
      </View>

      {/* 월 선택 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={currentMonth}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(itemValue) => {
            let nextDay = currentDay;
            if (itemValue === nowMonth) {
              if (currentDay > nowDay) {
                nextDay = nowDay;
              }
            }
            const newDate = createNewDate(currentYear, itemValue, nextDay);
            setDateOfBirth(newDate);
          }}
        >
          {months.map((month) => (
            <Picker.Item key={month} label={`${month}월`} value={month} />
          ))}
        </Picker>
      </View>

      {/* 일 선택 */}
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={currentDay}
          style={styles.picker}
          itemStyle={styles.pickerItem}
          onValueChange={(itemValue) => {
            const newDate = createNewDate(currentYear, currentMonth, itemValue);
            setDateOfBirth(newDate);
          }}
        >
          {availableDays.map((day) => (
            <Picker.Item key={day} label={`${day}일`} value={day} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  birthInputSection: {
    // marginTop: 10,
  },
  birthContainer: {
    flexDirection: "row",
    // gap: 8,
    borderRadius: 12,
    padding: 4,
    height: 200,
  },
  yearPickerWrapper: {
    flex: 1.3,
    height: 200,
    overflow: "hidden",
    backgroundColor: COLORS.background.white,
    borderRadius: 8,
  },
  pickerWrapper: {
    flex: 1,
    height: 200,
    overflow: "hidden",
    backgroundColor: COLORS.background.white,
    borderRadius: 8,
  },
  picker: {
    flex: 1,
  },
  pickerItem: {
    fontSize: 16,
    height: 200,
    color: COLORS.text.black,
  },
});
