  import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
  import { TextInput, useTheme } from 'react-native-paper';
  import { useEffect, useRef, useState } from 'react';

  //셰프토리 커스템 selectC input
  export default function CheftorySelectInput({
    label,
    value,
    placeholder = "선택하세요",
    disabled = false,
    left="chevron-down",
    isFocused,
    toFocus,
    isValid,
  }: {
    label: string;
    value: string;
    placeholder?: string;
    disabled?: boolean;
    left?: IconSource;
    isFocused: boolean;
    toFocus: () => void;
    isValid: boolean|null;
  }) {
    const theme = useTheme();

    return (
      <TextInput
        label={label}
        value={value || placeholder}
        editable={false}
        onPressIn={toFocus} // 클릭 시 모달/피커 열기
        pointerEvents="auto"
        outlineColor={isFocused ? theme.colors.primary : theme.colors.outline}
        activeOutlineColor={isFocused ? theme.colors.primary : theme.colors.outline}
        mode="outlined"
        error={isValid !== null || !isValid}
        theme={{
          colors: {
            onSurfaceVariant: isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant,
          }
        }}
        right={
          <TextInput.Icon 
            icon={left} 
            color={isFocused ? theme.colors.primary : theme.colors.onSurfaceVariant}
            onPress={toFocus}
          />
        }
      />
    );
  }

