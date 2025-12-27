const { withGradleProperties, withAppBuildGradle, withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Expo config plugin to automatically setup Android keystore for release builds
 */
const withAndroidKeystore = (config) => {
  // 1. Copy keystore to android/app
  config = withKeystoreCopy(config);

  // 2. Add gradle properties
  config = withGradleProperties(config, (config) => {
    config.modResults.push({
      type: "property",
      key: "CHEFTORY_UPLOAD_STORE_FILE",
      value: "cheftory.jks",
    });
    config.modResults.push({
      type: "property",
      key: "CHEFTORY_UPLOAD_KEY_ALIAS",
      value: process.env.KEYSTORE_ALIAS || "upload",
    });
    config.modResults.push({
      type: "property",
      key: "CHEFTORY_UPLOAD_STORE_PASSWORD",
      value: process.env.KEYSTORE_PASSWORD || "",
    });
    config.modResults.push({
      type: "property",
      key: "CHEFTORY_UPLOAD_KEY_PASSWORD",
      value: process.env.KEY_PASSWORD || process.env.KEYSTORE_PASSWORD || "",
    });
    return config;
  });

  // 3. Update build.gradle
  config = withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;

    // Check if signingConfigs already modified
    if (buildGradle.includes("CHEFTORY_UPLOAD_STORE_FILE")) {
      return config;
    }

    // Add release signing config
    const signingConfigsBlock = `    signingConfigs {
        debug {
            storeFile file('debug.keystore')
            storePassword 'android'
            keyAlias 'androiddebugkey'
            keyPassword 'android'
        }
        release {
            if (project.hasProperty('CHEFTORY_UPLOAD_STORE_FILE')) {
                storeFile file(CHEFTORY_UPLOAD_STORE_FILE)
                storePassword CHEFTORY_UPLOAD_STORE_PASSWORD
                keyAlias CHEFTORY_UPLOAD_KEY_ALIAS
                keyPassword CHEFTORY_UPLOAD_KEY_PASSWORD
            }
        }
    }`;

    // Replace existing signingConfigs
    config.modResults.contents = buildGradle.replace(
      /signingConfigs\s*\{[\s\S]*?\n\s{4}\}/,
      signingConfigsBlock
    );

    // Update release buildType to use release signingConfig
    config.modResults.contents = config.modResults.contents.replace(
      /(release\s*\{[\s\S]*?)signingConfig signingConfigs\.debug/,
      "$1signingConfig signingConfigs.release"
    );

    return config;
  });

  return config;
};

/**
 * Copy keystore file to android/app during prebuild
 */
const withKeystoreCopy = (config) => {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const sourceKeystore = path.join(projectRoot, "@cheftory__cheftory.jks");
      const targetKeystore = path.join(
        projectRoot,
        "android",
        "app",
        "cheftory.jks"
      );

      // Copy keystore if exists
      if (fs.existsSync(sourceKeystore)) {
        const targetDir = path.dirname(targetKeystore);
        if (!fs.existsSync(targetDir)) {
          fs.mkdirSync(targetDir, { recursive: true });
        }
        fs.copyFileSync(sourceKeystore, targetKeystore);
        console.log("✅ Copied keystore to android/app/cheftory.jks");
      } else {
        console.warn("⚠️  Keystore not found at @cheftory__cheftory.jks");
      }

      return config;
    },
  ]);
};

module.exports = withAndroidKeystore;
