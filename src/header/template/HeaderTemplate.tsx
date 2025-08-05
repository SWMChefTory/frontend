// CustomHeader.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/src/modules/shared/constants/colors';

interface CheftoryHeaderProps {
  title: string | React.ReactNode;
  showBackButton?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  onBackPress?: () => void;
}

export function HeaderTemplate({ 
  title, 
  showBackButton = false, 
  leftComponent,
  rightComponent,
  onBackPress
}: CheftoryHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.headerContent}>
        {/* 왼쪽 영역 */}
        <View style={styles.leftSection}>
          {showBackButton && (
            <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color={COLORS.text.black} />
            </TouchableOpacity>
          )}
          {leftComponent}
        </View>
        
        {/* 타이틀 (leftComponent가 없을 때만 표시) */}
        {!leftComponent && (
          <View style={styles.titleSection}>
            {typeof title === 'string' ? (
              <Text style={styles.title}>{title}</Text>
            ) : (
              title
            )}
          </View>
        )}
        
        {/* 오른쪽 영역 */}
        <View style={styles.rightSection}>
          {rightComponent}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.background.white,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  leftSection: {
    paddingLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: 150, // 고정 너비
    justifyContent: 'flex-start',
  },
  titleSection: {
    flex: 1,
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: 150, // leftSection과 동일한 너비
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.black,
  },
  backButton: {
    paddingVertical: 8,
    marginRight: 8,
  },
});