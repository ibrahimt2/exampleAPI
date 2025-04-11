const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const version = execSync("python3 scripts/get_version.py").toString().trim();
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));

if (pkg.version !== version) {
  console.error("❌ Version mismatch detected:");
  console.error("→ openapi.yaml:       ", version);
  console.error("→ client/package.json:", pkg.version);
  process.exit(1);
}

console.log("✅ Versions match:", version);