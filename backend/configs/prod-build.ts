// INFO: this is more proper i guess since in prod you wont use nodemon instead just node
// also less mess in package.json scripts

import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import process from "process";

const backendDist = path.join(process.cwd(), "backend", "dist");

// Webpack Build
console.log("🛠️  Running Webpack for frontend...");
try {
  execSync("webpack --config frontend/configs/webpack.prod.js", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ Webpack build failed.");
  process.exit(1);
}

// Clean: Remove old build
//console.log("🧹 Cleaning build ...");
//if (fs.existsSync(backendDist)) {
//  fs.rmSync(backendDist, { recursive: true, force: true });
//}

// Lint
//console.log("🔍 Running ESLint on / ...");
//try {
//  execSync("npx eslint_d .", { stdio: "inherit" });
//} catch (error) {
//  console.warn("⚠️ ESLint warnings found.");
//}

// Type-Check
console.log("📏 Compiling TypeScript on Backend into backed/dist ...");
try {
  execSync("tsc -p backend/configs/tsconfig.json", { stdio: "inherit" });
  //execSync("tsc ", { stdio: "inherit" });
} catch (error) {
  console.error("❌ TypeScript errors found. Fix them first.");
  process.exit(1);
}

// SWC Build
console.log("🛠️  Running SWC for transpiling");
try {
  execSync("swc src --out-dir backend/dist/", {
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ SWC failed.");
  process.exit(1);
}

console.log("✅ Build completed successfully!");
