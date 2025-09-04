export default {
  expo: {
    name: "ChefTory",
    slug: "cheftory",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/images/mainCharacter.png",
    scheme: "cheftory",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    owner: "cheftory", //eas build 소유 organization 이거는 unique한거라 cheftory로 만들 수 없음.
    "splash": {
      "image": "./assets/images/splashscreen_logo.png",
      "resizeMode": "contain",
      "backgroundColor": "#FFFFFF"
    },
    ios: {
      entitlements: {
        "com.apple.security.application-groups": [
          "group.com.cheftory.cheftory",
        ],
      },
      deploymentTarget: "17.2",
      appleTeamId: "TCMRDSDB39",
      supportsTablet: true,
      bundleIdentifier: "com.cheftory.cheftory",
      usesAppleSignIn: true, //이런거 보고 expo가 알아서 apple sign in 설정
      infoPlist: {
        UIBackgroundModes: ["audio", "fetch", "remote-notification"],
        NSUserNotificationUsageDescription:
          "타이머 종료 시 알림을 보내기 위해 필요합니다.",
        NSSupportsLiveActivities: true, //이런거 보고 push notification 설정
        NSFaceIDUsageDescription:
          "안전한 로그인과 인증을 위해 Face ID를 사용합니다.",
        NSMicrophoneUsageDescription: "셰프토리는 음성으로 레시피를 제어하기 위해 마이크 접근 권한이 필요합니다.",
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: true,
        },
        CFBundleURLTypes: [
          {
            CFBundleURLName: "google-oauth",
            CFBundleURLSchemes: [
              "com.googleusercontent.apps.248373759203-lvs4hmrf3na2kookbmm17p2bp8ccqqbk",
            ],
          },
          {
            CFBundleURLName: "apple-signin",
            CFBundleURLSchemes: ["com.cheftory.cheftory"],
          },
          {
            CFBundleURLName: "app-deeplink",
            CFBundleURLSchemes: ["cheftory"],
          },
        ],
      },
    },
    android: {
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
        "android.permission.AUDIO_CAPTURE",
      ],
      adaptiveIcon: {
        foregroundImage: "./assets/images/mainCharacter.png",
        backgroundColor: "#FFF5F0",
      },
      edgeToEdgeEnabled: true,
      package: "com.cheftory.cheftory",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/mainCharacter.png",
    },
    plugins: [
      "expo-router",
      "@bacons/apple-targets",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/mainCharacter.png",
          imageWidth: 180,
          resizeMode: "contain",
          backgroundColor: "#FFF5F0",
        },
      ],
      "expo-secure-store",
      "expo-font",
      "expo-web-browser",
      "expo-apple-authentication",
      "@react-native-google-signin/google-signin"
    ],
    experiments: {
      typedRoutes: true,
      reactCanary: true,
    },
    extra: {
      router: {
        origin: false,
        autoLinking: true,
      },
      eas: {
        projectId: "745eee82-c2f6-4403-91f6-4859abb54740",
      },
    },
  },
};
