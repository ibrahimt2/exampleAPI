const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const toml = require("toml");

// Helper to extract version using yq
function getVersionFromFile(command) {
  return execSync(command).toString().trim();
}

const openapiVersion = getVersionFromFile("yq '.info.version' spec/server.yaml");
const npmPackageJson = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf8"));
const npmVersion = npmPackageJson.version;
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

if (mismatch) {
  process.exit(1);
}

console.log("✅ All versions match:", openapiVersion);