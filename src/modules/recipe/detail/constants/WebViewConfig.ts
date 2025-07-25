import { Platform } from "react-native";

export const WEBVIEW_CONFIG = {
  BASE_URL: "https://cheftory-youtube-webview.surge.sh",

  USER_AGENTS: {
    IOS: "Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1",
    ANDROID:
      "Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36",
  },

  LOADING_CONFIG: {
    LOADING_TEXT: "레시피를 불러오는 중...",
    SPINNER_COLOR: "#007AFF",
    SPINNER_SIZE: "large" as const,
  },

  ERROR_MESSAGES: {
    LOAD_ERROR: "페이지 로드 오류",
    LOAD_ERROR_DESCRIPTION: "페이지를 불러오는데 문제가 발생했습니다.",
    BACK_BUTTON_TEXT: "뒤로가기",
    RETRY_BUTTON_TEXT: "다시 시도",
  },

  // 유튜브 최적화를 위한 JavaScript 주입
  OPTIMIZATION_SCRIPT: `
    // 유튜브 플레이어 최적화
    (function() {
      // 하드웨어 가속 강제 활성화
      const style = document.createElement('style');
      style.innerHTML = \`
        video {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: transform;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        
        iframe[src*="youtube"] {
          transform: translateZ(0);
          -webkit-transform: translateZ(0);
          will-change: transform;
        }
      \`;
      document.head.appendChild(style);

      // 유튜브 플레이어 품질 최적화
      window.addEventListener('message', function(event) {
        if (event.data && typeof event.data === 'string') {
          try {
            const data = JSON.parse(event.data);
            if (data.event === 'video-ready') {
              // 자동 품질 조절 활성화
              const iframe = document.querySelector('iframe[src*="youtube"]');
              if (iframe) {
                iframe.style.willChange = 'transform';
              }
            }
          } catch (e) {
            // JSON 파싱 오류 무시
          }
        }
      });

      // 페이지 로드 최적화
      document.addEventListener('DOMContentLoaded', function() {
        // 불필요한 애니메이션 제거
        const metaViewport = document.querySelector('meta[name="viewport"]');
        if (metaViewport) {
          metaViewport.setAttribute('content', 
            'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
          );
        }
      });
    })();
    
    true; // 필수 반환값
  `,
} as const;

export const getUserAgent = (): string => {
  return Platform.OS === "ios"
    ? WEBVIEW_CONFIG.USER_AGENTS.IOS
    : WEBVIEW_CONFIG.USER_AGENTS.ANDROID;
};

export const getWebViewUrl = (recipeId: string): string => {
  return `${WEBVIEW_CONFIG.BASE_URL}/#/recipes/${recipeId}`;
};
