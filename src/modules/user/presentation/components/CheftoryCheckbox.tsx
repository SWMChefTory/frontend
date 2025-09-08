import * as React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Checkbox, Text, Button, IconButton } from 'react-native-paper';

export default function CheftoryCheckbox({
  checked,
  setChecked,
}: {
  checked: boolean;
  setChecked: (checked: boolean) => void;
//   label: string;
//   onViewTerms?: () => void;
}) {
  return (
    <View style={styles.container}>
      {/* 체크박스 + 라벨 영역 */}
      <Checkbox.Item
        label="약관에 동의합니다"
          status={checked ? 'checked' : 'unchecked'}
          onPress={() => setChecked(!checked)}
          position="leading"
        />
      <IconButton
        icon="chevron-right"    
        size={20}
        onPress={() => {}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
  },
  viewButton: {
    borderRadius: 4,
    minWidth: 50,
    marginLeft: 8,
  },
  viewButtonLabel: {
    fontSize: 12,
    marginVertical: 4,
  },
});