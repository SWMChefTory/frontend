// scripts/patchLinearGradient.js
const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(
  __dirname,
  "../node_modules/react-native-reanimated-skeleton",
);

function replaceInFile(filePath) {
  const code = fs.readFileSync(filePath, "utf-8");
  const patched = code
    // LinearGradient → { LinearGradient }
    .replace(/import\s+LinearGradient\b/g, "import { LinearGradient }")
    // 큰‧작은따옴표 모두 매칭
    .replace(/["']react-native-linear-gradient["']/g, "'expo-linear-gradient'");

  if (patched !== code) {
    fs.writeFileSync(filePath, patched, "utf-8");
    console.log("✅ Patched:", path.relative(rootDir, filePath));
  }
}

function walk(dir) {
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) walk(full);
    else if (/\.(c?m?js|jsx|ts|tsx)$/.test(full)) replaceInFile(full);
  }
}

console.log("🚀 Patching react-native-reanimated-skeleton for Expo…");
if (fs.existsSync(rootDir)) walk(rootDir);
else console.log("⚠️  package not found – skipping");
