// plugins/android-share-target.js
const fs = require("fs");
const path = require("path");
const {
  withAndroidManifest,
  withDangerousMod,
} = require("@expo/config-plugins");

const ACTIVITY_NAME = ".ShareActivity";
const THEME_NAME = "Theme.Transparent";
const VALUES_FILE = "share_target_styles.xml";

function ensureShareActivity(androidManifest) {
  const app = androidManifest.manifest.application?.[0];
  if (!app) return androidManifest;

  app.activity = app.activity || [];

  // 이미 추가돼 있으면 중복 방지
  const exists = app.activity.some(
    (a) => a.$?.["android:name"] === ACTIVITY_NAME,
  );
  if (exists) return androidManifest;

  const shareActivity = {
    $: {
      "android:name": ACTIVITY_NAME,
      "android:exported": "true",
      "android:theme": `@style/${THEME_NAME}`,
      "android:taskAffinity": "",
      "android:excludeFromRecents": "true",
      "android:launchMode": "singleTask",
    },
    "intent-filter": [
      // URL이 포함된 text만 받기
      {
        action: [{ $: { "android:name": "android.intent.action.SEND" } }],
        category: [
          { $: { "android:name": "android.intent.category.DEFAULT" } },
        ],
        data: [{ $: { "android:mimeType": "text/plain" } }],
      },
    ],
  };

  app.activity.push(shareActivity);
  return androidManifest;
}

function writeTransparentTheme(platformProjectRoot) {
  const valuesDir = path.join(
    platformProjectRoot,
    "app",
    "src",
    "main",
    "res",
    "values",
  );
  const outPath = path.join(valuesDir, VALUES_FILE);

  if (!fs.existsSync(valuesDir)) {
    fs.mkdirSync(valuesDir, { recursive: true });
  }

  if (fs.existsSync(outPath)) {
    const s = fs.readFileSync(outPath, "utf8");
    if (s.includes(`style name="${THEME_NAME}"`)) {
      return;
    }
  }

  const xml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <!-- 공유 Activity용 투명 테마 -->
  <style name="${THEME_NAME}" parent="android:Theme.Translucent.NoTitleBar">
    <item name="android:windowIsTranslucent">true</item>
    <item name="android:windowBackground">@android:color/transparent</item>
    <item name="android:windowNoTitle">true</item>
    <item name="android:backgroundDimEnabled">false</item>
    <item name="android:windowContentOverlay">@null</item>
    <item name="android:windowAnimationStyle">@android:style/Animation</item>
  </style>
</resources>
`;

  fs.writeFileSync(outPath, xml);
}

module.exports = function withShareTarget(config) {
  // 1) AndroidManifest 수정
  config = withAndroidManifest(config, (cfg) => {
    cfg.modResults = ensureShareActivity(cfg.modResults);
    return cfg;
  });

  // 2) res/values/*.xml 생성
  config = withDangerousMod(config, [
    "android",
    async (cfg) => {
      writeTransparentTheme(cfg.modRequest.platformProjectRoot);
      return cfg;
    },
  ]);

  return config;
};
