import { router, Stack, useLocalSearchParams } from "expo-router";
import { Alert, Platform, SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

export default function RecipeDetailScreen() {
  const { recipeId, youtubeId, title } = useLocalSearchParams<{
    recipeId: string;
    youtubeId?: string;
    title?: string;
  }>();    

  const webviewUrl = `https://colossal-heat.surge.sh/recipeId/${recipeId}`;

  // 플랫폼별 userAgent 설정
  const getUserAgent = () => {
    if (Platform.OS === 'ios') {
      return "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1";
    } else {
      return "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36";
    }
  };

  // 웹뷰에서 메시지를 받는 핸들러
  const handleMessage = (event: any) => {
    try {
      const message = event.nativeEvent.data;
      console.log('웹뷰에서 받은 메시지:', message);
      
      // JSON 형태의 메시지 파싱 시도
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message);
      } catch {
        // JSON이 아닌 경우 문자열로 처리
        parsedMessage = { type: message };
      }
      
      // 특정 메시지 타입에 따라 네비게이션
      if (message === 'FINISH_COOKING') {
        console.log('조리 종료. 첫 화면으로 이동합니다.');
        router.replace('/(tabs)'); // 탭 화면의 홈으로 이동
      }
      
      // 다른 메시지 타입들도 처리 가능
      if (parsedMessage.type === 'BACK_PRESSED') {
        router.back(); // 뒤로가기
      }
      
    } catch (error) {
      console.error('메시지 처리 중 오류:', error);
    }
  };

  // WebView 오류 핸들러
  const handleError = (error: any) => {
    console.error('WebView 오류:', error);
    Alert.alert(
      '페이지 로드 오류',
      '페이지를 불러오는데 문제가 발생했습니다.',
      [
        { text: '뒤로가기', onPress: () => router.back() },
        { text: '다시 시도', onPress: () => {} }
      ]
    );
  };

  // HTTP 오류 핸들러
  const handleHttpError = (error: any) => {
    console.error('HTTP 오류:', error);
  };

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <Stack.Screen options={{ headerShown: false }} />
        <WebView
          source={{uri: webviewUrl}}
          style={{ flex: 1 }}
          // 미디어 재생 관련 설정 (자동재생 활성화)
          mediaPlaybackRequiresUserAction={false} // 자동 재생 활성화
          allowsInlineMediaPlayback={Platform.OS === 'ios'} // iOS에서만 활성화
          allowsFullscreenVideo={false} // 전체화면 비활성화로 메모리 절약
          allowsBackForwardNavigationGestures={Platform.OS === 'ios'} // iOS에서만 활성화
          // 보안 및 호환성 설정
          mixedContentMode="never" // 더 안전한 설정
          allowsLinkPreview={false}
          dataDetectorTypes="none"
          // 기본 기능 설정
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          // 안드로이드 안정성 설정 (갤럭시 S10 호환성)
          androidLayerType="software" // 소프트웨어 렌더링으로 변경
          cacheEnabled={false} // 메모리 절약을 위해 캐시 비활성화
          cacheMode="LOAD_NO_CACHE"
          // 메모리 관리 (하드웨어 가속 비활성화)
          androidHardwareAccelerationDisabled={true}
          // 플랫폼별 사용자 에이전트 설정
          userAgent={getUserAgent()}
          // 이벤트 핸들러
          onMessage={handleMessage}
          onError={handleError}
          onHttpError={handleHttpError}
          onLoadStart={() => console.log('페이지 로딩 시작')}
          onLoadEnd={() => console.log('페이지 로딩 완료')}
          // 렌더링 프로세스 크래시 처리 (안드로이드)
          onRenderProcessGone={(event) => {
            console.error('WebView 렌더링 프로세스 크래시:', event.nativeEvent);
            Alert.alert(
              '앱 오류',
              '페이지 렌더링에 문제가 발생했습니다. 다시 시도해주세요.',
              [{ text: '확인', onPress: () => router.back() }]
            );
          }}
        />
      </SafeAreaView>
    </>
  );
}