import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WEBVIEW_CONFIG } from '../constants/WebViewConfig';

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
}

export function LoadingOverlay({ isVisible, text = WEBVIEW_CONFIG.LOADING_CONFIG.LOADING_TEXT }: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <ActivityIndicator 
        size={WEBVIEW_CONFIG.LOADING_CONFIG.SPINNER_SIZE} 
        color={WEBVIEW_CONFIG.LOADING_CONFIG.SPINNER_COLOR} 
      />
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
}); 