import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Not node_modules/prismjs: markdown-it-prism, which highlights the docs, resolves the real
// `prismjs` package from there, and it needs v1
const root = path.resolve(__dirname, "..");
const prismPath = path.join(root, ".prism");

// --- Cloning & Installing Prism ---
console.log("[postinstall] Cloning Prism...");
// Ensure we work with a fresh copy
await fs.rm(prismPath, { recursive: true, force: true });
execSync("git clone --depth 1 https://github.com/PrismJS/prism.git .prism", {
	cwd: root,
	stdio: "inherit",
});

console.log("[postinstall] Installing Prism dependencies...");
execSync("npm install", {
	cwd: prismPath,
	stdio: "inherit",
});

console.log("[postinstall] Building Prism...");
execSync("npm run build", {
	cwd: prismPath,
	stdio: "inherit",
});
