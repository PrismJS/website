import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const sourcePath = path.resolve(__dirname, "../node_modules/prismjs/src/plugins");
const destPath = path.resolve(__dirname, "../plugins");

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

await copy();

// Create plugins.json in the plugins folder with global data
let json = {
	permalink: "{{ page.filePathStem.replace('README', '/index') }}.html",
	tags: ["plugin"],
};

await fs.writeFile(path.join(destPath, "plugins.json"), JSON.stringify(json, null, "\t"));
