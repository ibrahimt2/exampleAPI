const fs    = require("fs");
const path  = require("path");
const child = require("child_process");
const toml  = require("toml");
const tomlify = require("tomlify-j0.4"); 

// 1) Read version from OpenAPI
const version = child
  .execSync("yq -r '.info.version' spec/server.yaml")
  .toString().trim();
console.log("🔖 Version to sync:", version);

// 2) Update package.json
const pkgPath = path.join(__dirname, "..", "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
console.log("✅ Synced package.json");

// 3) Update root pyproject.toml
const pyPath = path.join(__dirname, "..", "pyproject.toml");
let py = fs.readFileSync(pyPath, "utf8");
let pyObj = toml.parse(py);
pyObj.project.version = version;
fs.writeFileSync(pyPath, tomlify.toToml(pyObj, { space: 2 }));
console.log("✅ Synced pyproject.toml");

// 4) Update AsyncAPI spec version
let asyncdoc = fs.readFileSync("spec/asyncapi.yaml", "utf8");
asyncdoc = asyncdoc.replace(
  /version:\s*".*"/,
  `version: "${version}"`
);
fs.writeFileSync("spec/asyncapi.yaml", asyncdoc);
console.log("✅ Synced spec/asyncapi.yaml");
