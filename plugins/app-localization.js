const { withInfoPlist, withStringsXml } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

/**
 * Config Plugin for localizing app name
 * Supports iOS and Android app name localization
 */
const withAppLocalization = (config) => {
  const appLocalizations = {
    en: "Cheftory",
    ko: "쉐프토리",
  };

  // iOS: Create InfoPlist.strings files
  config = withInfoPlist(config, (config) => {
    const projectRoot = config.modRequest.platformProjectRoot;

    Object.entries(appLocalizations).forEach(([locale, appName]) => {
      const lprojPath = path.join(projectRoot, "app", `${locale}.lproj`);
      const stringsFilePath = path.join(lprojPath, "InfoPlist.strings");

      // Create .lproj directory if it doesn't exist
      if (!fs.existsSync(lprojPath)) {
        fs.mkdirSync(lprojPath, { recursive: true });
      }

      // Write InfoPlist.strings file
      const stringsContent = `/* ${locale.toUpperCase()} Localization */\nCFBundleDisplayName = "${appName}";\n`;
      fs.writeFileSync(stringsFilePath, stringsContent, "utf-8");
    });

    return config;
  });

  // Android: Create strings.xml files for each locale
  config = withStringsXml(config, (config) => {
    const projectRoot = config.modRequest.platformProjectRoot;

    Object.entries(appLocalizations).forEach(([locale, appName]) => {
      const valuesDir =
        locale === "en"
          ? path.join(projectRoot, "app", "src", "main", "res", "values-en")
          : path.join(projectRoot, "app", "src", "main", "res", "values");

      const stringsXmlPath = path.join(valuesDir, "strings.xml");

      // Create directory if it doesn't exist
      if (!fs.existsSync(valuesDir)) {
        fs.mkdirSync(valuesDir, { recursive: true });
      }

      // Read existing strings.xml or create new one
      let stringsContent;
      if (fs.existsSync(stringsXmlPath)) {
        stringsContent = fs.readFileSync(stringsXmlPath, "utf-8");

        // Update app_name if exists, otherwise add it
        if (stringsContent.includes('name="app_name"')) {
          stringsContent = stringsContent.replace(
            /<string name="app_name">.*?<\/string>/,
            `<string name="app_name">${appName}</string>`
          );
        } else {
          stringsContent = stringsContent.replace(
            /<resources>/,
            `<resources>\n  <string name="app_name">${appName}</string>`
          );
        }
      } else {
        stringsContent = `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n  <string name="app_name">${appName}</string>\n</resources>\n`;
      }

      fs.writeFileSync(stringsXmlPath, stringsContent, "utf-8");
    });

    return config;
  });

  return config;
};

module.exports = withAppLocalization;
