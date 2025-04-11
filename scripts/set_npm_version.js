const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const version = execSync("python3 scripts/get_version.py").toString().trim();

const pkgPath = path.join(__dirname, "../package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
pkg.version = version;
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log("✅ Synced NPM version to", version);