import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const root = path.resolve(__dirname, "../node_modules");
const prismPath = path.join(root, "prismjs");

let sourcePath, destPath;

// --- Cloning & Installing Prism ---
console.log("[postinstall] Cloning Prism...");
// Ensure we work with a fresh copy
await fs.rm(prismPath, { recursive: true, force: true });
// FIXME: Remove “--branch v2” when Prism v2 is released to fallback to the default branch
execSync("git clone --branch v2 https://github.com/PrismJS/prism.git prismjs", {
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
destPath = path.resolve(__dirname, "../plugins");

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

			let name = path.parse(file.name).name;
			// Copy only the README.md and demo.* files
			if (["README", "demo"].includes(name)) {
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

// Create plugins.json in the plugins folder with global data
console.log("[postinstall] Creating plugins.json...");
let json = {
	permalink: "{{ page.filePathStem.replace('README', '/index') }}.html",
	tags: ["plugin"],
};

await fs.writeFile(path.join(destPath, "plugins.json"), JSON.stringify(json, null, "\t"));

// --- Copying other files (components.json, file-sizes.json, etc.) ---
sourcePath = path.join(prismPath, "dist");
destPath = path.resolve(__dirname, "..");

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
