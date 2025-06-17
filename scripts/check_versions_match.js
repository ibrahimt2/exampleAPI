const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const toml = require("toml");

// Helper to extract a version using yq
function getVersionFromFile(command) {
  return execSync(command, { stdio: ["ignore", "pipe", "inherit"] })
    .toString()
    .trim();
}

// 1) OpenAPI spec version
const openapiVersion = getVersionFromFile(
  "yq '.info.version' spec/server.yaml"
);

// 2) AsyncAPI spec version
const asyncapiVersion = getVersionFromFile(
  "yq '.info.version' spec/asyncapi.yaml"
);

// 3) package.json (npm) version
const npmPkg = JSON.parse(
  fs.readFileSync(path.join(__dirname, "..", "package.json"), "utf8")
);
const npmVersion = npmPkg.version;

// 4) root pyproject.toml (Python) version
const pyprojectPath = path.join(__dirname, "..", "pyproject.toml");
if (!fs.existsSync(pyprojectPath)) {
  console.error(`❌ Could not find ${pyprojectPath}`);
  process.exit(1);
}
const pyprojectContent = fs.readFileSync(pyprojectPath, "utf8");
const pyproject = toml.parse(pyprojectContent);
const pythonVersion = pyproject.project?.version;

// Display all versions
console.log("🔍 Version check summary:");
console.log("📄 OpenAPI spec:       ", openapiVersion);
console.log("📡 AsyncAPI spec:      ", asyncapiVersion);
console.log("📦 Node package.json:  ", npmVersion);
console.log("🐍 Python pyproject:   ", pythonVersion);

// Compare
let mismatch = false;

if (npmVersion !== openapiVersion) {
  console.error("❌ Version mismatch between package.json and OpenAPI spec!");
  mismatch = true;
}

if (pythonVersion !== openapiVersion) {
  console.error("❌ Version mismatch between pyproject.toml and OpenAPI spec!");
  mismatch = true;
}

if (asyncapiVersion !== openapiVersion) {
  console.error("❌ Version mismatch between asyncapi.yaml and OpenAPI spec!");
  mismatch = true;
}

if (mismatch) {
  process.exit(1);
}

console.log("✅ All versions match:", openapiVersion);