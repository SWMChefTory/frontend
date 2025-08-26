export default {
  expo: {
    name: "ChefTory",
    owner: "cheftory",
    slug: "cheftory",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/images/mainCharacter.png",
    scheme: "cheftory",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
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
      package: "com.anonymous.cheiftory",
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
          imageWidth: 205,
          resizeMode: "contain",
          backgroundColor: "#FFF5F0",
        },
      ],
      "expo-secure-store",
      "expo-font",
      "expo-web-browser",
      "expo-apple-authentication",
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
        projectId: "bfa31b78-8718-4e7f-9733-56529cecf388",
      },
    },
  },
};
