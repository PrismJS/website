import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Not node_modules/prismjs: markdown-it-prism, which highlights the docs, resolves the real
// `prismjs` package from there, and it needs v1
const root = path.resolve(__dirname, "..");
const prismPath = path.join(root, ".prism");

let sourcePath, destPath;

// --- Cloning & Installing Prism ---
console.log("[postinstall] Cloning Prism...");
// Ensure we work with a fresh copy
await fs.rm(prismPath, { recursive: true, force: true });
execSync("git clone https://github.com/PrismJS/prism.git .prism", {
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

// --- Working with plugins ---
sourcePath = path.join(prismPath, "src/plugins");
destPath = path.resolve(__dirname, "../docs/plugins");

async function copy () {
	// We need { recursive: true } so the script doesn't fail if the folder already exists
	await fs.mkdir(destPath, { recursive: true });

	let plugins = await fs.readdir(sourcePath, { withFileTypes: true });
	for (let plugin of plugins) {
		if (!plugin.isDirectory()) {
			continue;
		}

		let source = path.join(sourcePath, plugin.name);
		let dest = path.join(destPath, plugin.name);
		await fs.mkdir(dest, { recursive: true });

		let files = await fs.readdir(source, { withFileTypes: true });
		for (let file of files) {
			if (!file.isFile()) {
				continue;
			}

			let filename = path.parse(file.name).base;
			if (["README.md", "demo.md"].includes(filename)) {
				await fs.copyFile(path.join(source, file.name), path.join(dest, file.name));
			}
		}
	}
}

console.log("[postinstall] Copying Prism plugins docs...");
try {
	await copy();
}
catch (error) {
	console.error(`[postinstall] Failed to copy Prism plugins docs: ${error.message}`);
}

// --- Copying other files (components.json, file-sizes.json, etc.) ---
sourcePath = path.join(prismPath, "dist");
destPath = path.resolve(__dirname, "../docs");

let filenames = ["components.json", "file-sizes.json"];
for (let file of filenames) {
	console.log(`[postinstall] Copying ${file}...`);
	try {
		await fs.copyFile(path.join(sourcePath, file), path.join(destPath, file));
	}
	catch (error) {
		console.error(`[postinstall] Failed to copy ${file}: ${error.message}`);
	}
}
