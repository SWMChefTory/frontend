const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

function withShareActivity(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const platformProjectRoot = config.modRequest.platformProjectRoot;
      const packageName = config.android?.package || "com.cheftory.cheftory";
      const packagePath = packageName.replace(/\./g, "/");
      const stringResources = [
        {
          name: "share_callout_title",
          ko: "레시피 생성이 가능합니다!",
          en: "You can create a recipe!",
        },
        {
          name: "share_action_create",
          ko: "생성하기",
          en: "Create",
        },
      ];

      // 1. ShareActivity.java 생성 (간단한 버전)
      const activityDir = path.join(
        platformProjectRoot,
        `app/src/main/java/${packagePath}`,
      );

      const activityContent = `
package ${packageName};

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.net.Uri;
import android.widget.Button;
import android.view.View;

public class ShareActivity extends Activity {
    private Intent shareIntent;
    private String shareAction;
    private String shareType;
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(getResources().getIdentifier("share_activity", "layout", getPackageName()));
        
        shareIntent = getIntent();
        shareAction = shareIntent.getAction();
        shareType = shareIntent.getType();
        
        setupViews();
    }
    
    private void setupViews() {
        // 생성하기 버튼
        Button createRecipeButton = findViewById(getResources().getIdentifier("create_recipe_button", "id", getPackageName()));
        if (createRecipeButton != null) {
            createRecipeButton.setOnClickListener(v -> openCheftoryApp());
        }
        
        // 배경 클릭으로 닫기
        View backgroundOverlay = findViewById(getResources().getIdentifier("background_overlay", "id", getPackageName()));
        if (backgroundOverlay != null) {
            backgroundOverlay.setOnClickListener(v -> finish());
        }
    }
    
    private String extractYouTubeVideoId(String url) {
      if (url == null) return null;
      url = url.trim();
  
      try {
          Uri uri = Uri.parse(url);
          if (uri.getHost() != null && uri.getHost().contains("youtu.be")) {
              String path = uri.getPath();
              if (path == null) return null;
              String[] parts = path.split("/");
              if (parts.length >= 2) {
                  if ("shorts".equals(parts[1]) && parts.length >= 3) {
                      return parts[2];
                  }
                  return parts[1];
              }
              return null;
          }
  
          if (uri.getHost() != null && uri.getHost().contains("youtube.com")) {
              String path = uri.getPath();
              if (path != null && path.startsWith("/shorts/")) {
                  String[] parts = path.split("/");
                  if (parts.length >= 3) return parts[2];
              }
              String v = uri.getQueryParameter("v");
              if (v != null && !v.isEmpty()) return v;
          }
  
          // fallback regex
          java.util.regex.Pattern p = java.util.regex.Pattern.compile("(?<=v=|be/|shorts/)([\\\\w-]{6,})");
          java.util.regex.Matcher m = p.matcher(url);
          if (m.find()) return m.group(1);
  
      } catch (Exception ignored) {}
      return null;
    }
    
    private void openCheftoryApp() {
        if (!Intent.ACTION_SEND.equals(shareAction) || shareType == null) {
            finish();
            return;
        }

        // 텍스트만 지원(요구사항: url만 받는다) — 이미지/비디오는 무시
        if (!"text/plain".equals(shareType)) {
            finish();
            return;
        }

        String sharedText = shareIntent.getStringExtra(Intent.EXTRA_TEXT);
        if (sharedText == null) {
            finish();
            return;
        }

        // 유튜브 videoId 추출
        String videoId = extractYouTubeVideoId(sharedText);
        if (videoId == null) {
            // 유효한 유튜브 URL이 아니면 그냥 종료(원하면 다른 딥링크로 처리 가능)
            finish();
            return;
        }

        // iOS와 동일하게 JS 훅이 처리할 수 있는 형태로 딥링크 생성
        String deepLink = "cheftory://?video-id=" + Uri.encode(videoId) + "&external=true";

        Intent viewIntent = new Intent(Intent.ACTION_VIEW, Uri.parse(deepLink));
        // 내부 앱만 처리하도록(원하면 제거 가능). 기본 카테고리는 DEFAULT면 충분.
        viewIntent.addCategory(Intent.CATEGORY_DEFAULT);
        // 기존 태스크 재사용
        viewIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_SINGLE_TOP);

        startActivity(viewIntent);
        finish();
    }
}
`;

      if (!fs.existsSync(activityDir)) {
        fs.mkdirSync(activityDir, { recursive: true });
      }

      fs.writeFileSync(
        path.join(activityDir, "ShareActivity.java"),
        activityContent,
      );

      // 2. 레이아웃 파일 생성 (간단한 알림 스타일)
      const layoutDir = path.join(
        platformProjectRoot,
        "app/src/main/res/layout",
      );
      if (!fs.existsSync(layoutDir)) {
        fs.mkdirSync(layoutDir, { recursive: true });
      }

      const layoutContent = `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/background_overlay"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#80000000"
    android:clickable="true">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_gravity="bottom"
        android:background="@drawable/notification_bg"
        android:orientation="horizontal"
        android:padding="20dp"
        android:gravity="center_vertical"
        android:layout_marginLeft="16dp"
        android:layout_marginRight="16dp"
        android:layout_marginBottom="100dp"
        android:clickable="true">

        <!-- 메시지 텍스트 -->
        <TextView
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="@string/share_callout_title"
            android:textColor="#FFFFFF"
            android:textSize="16sp"
            android:textStyle="bold"
            android:layout_marginEnd="16dp" />

        <!-- 생성하기 버튼 -->
        <Button
            android:id="@+id/create_recipe_button"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:background="@drawable/white_button_bg"
            android:text="@string/share_action_create"
            android:textColor="#FF6B35"
            android:textSize="14sp"
            android:textStyle="bold"
            android:paddingHorizontal="20dp"
            android:paddingVertical="12dp" />

    </LinearLayout>

</FrameLayout>`;

      fs.writeFileSync(
        path.join(layoutDir, "share_activity.xml"),
        layoutContent,
      );

      const valuesDir = path.join(
        platformProjectRoot,
        "app/src/main/res/values",
      );
      const valuesEnDir = path.join(
        platformProjectRoot,
        "app/src/main/res/values-en",
      );

      function upsertStringsFile(targetDir, entries, languageKey) {
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }

        const stringsPath = path.join(targetDir, "strings.xml");
        let xml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n`;

        if (fs.existsSync(stringsPath)) {
          xml = fs.readFileSync(stringsPath, "utf8");
          if (!xml.includes("<resources")) {
            xml = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n</resources>\n`;
          }
        }

        let updated = false;
        entries.forEach((entry) => {
          const matcher = new RegExp(`<string\\s+name=["']${entry.name}["']`);
          if (matcher.test(xml)) {
            return;
          }
          const value = entry[languageKey];
          xml = xml.replace(
            /<\/resources>\s*$/,
            `  <string name="${entry.name}">${value}</string>\n</resources>\n`,
          );
          updated = true;
        });

        if (updated) {
          fs.writeFileSync(stringsPath, xml);
        }
      }

      upsertStringsFile(valuesDir, stringResources, "ko");
      upsertStringsFile(valuesEnDir, stringResources, "en");

      // 3. Drawable 리소스들 생성 (간단한 버전)
      const drawableDir = path.join(
        platformProjectRoot,
        "app/src/main/res/drawable",
      );
      if (!fs.existsSync(drawableDir)) {
        fs.mkdirSync(drawableDir, { recursive: true });
      }

      // notification_bg.xml - 주황색 배경
      const notificationBg = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
    <solid android:color="#FF6B35" />
    <corners android:radius="16dp" />
</shape>`;

      // white_button_bg.xml - 흰색 버튼
      const whiteButtonBg = `<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="true">
        <shape>
            <solid android:color="#F0F0F0" />
            <corners android:radius="12dp" />
        </shape>
    </item>
    <item>
        <shape>
            <solid android:color="#FFFFFF" />
            <corners android:radius="12dp" />
        </shape>
    </item>
</selector>`;

      fs.writeFileSync(
        path.join(drawableDir, "notification_bg.xml"),
        notificationBg,
      );
      fs.writeFileSync(
        path.join(drawableDir, "white_button_bg.xml"),
        whiteButtonBg,
      );

      return config;
    },
  ]);
}

module.exports = withShareActivity;
