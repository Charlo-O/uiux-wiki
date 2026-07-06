import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const distDir = "dist";
const assetDir = join(distDir, "assets");

if (!existsSync(join(distDir, "index.html"))) {
  throw new Error("dist/index.html was not generated.");
}

const cname = readFileSync(join(distDir, "CNAME"), "utf8").trim();
if (cname !== "www.uiux.wiki") {
  throw new Error(`dist/CNAME is ${cname || "empty"}; expected www.uiux.wiki.`);
}

if (!existsSync(assetDir)) {
  throw new Error("dist/assets was not generated.");
}

const bundleText = readdirSync(assetDir)
  .filter((file) => /\.(js|css)$/.test(file))
  .map((file) => readFileSync(join(assetDir, file), "utf8"))
  .join("\n");

const requiredTexts = [
  "uiux.wiki",
  "OpenAI-compatible API",
  "Web Interaction Design Assistant",
  "AI result.md",
];

const missing = requiredTexts.filter((text) => !bundleText.includes(text));

if (missing.length > 0) {
  throw new Error(`Built site is missing production product copy: ${missing.join(", ")}`);
}

console.log("Smoke test passed: built site contains current uiux.wiki product copy.");
