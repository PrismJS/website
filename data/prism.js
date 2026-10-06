import fs from "fs";
import components from "../.prism/dist/components.json" with { type: "json" };
import pkg from "../.prism/package.json" with { type: "json" };

// Every category keeps a `meta` entry among its components
let { meta, ...languages } = components.languages;

/**
 * Bytes of a built file, or 0 for a component that has no such file
 * @param {string} file - The path in Prism's dist, like "languages/css.js"
 */
function size (file) {
	let url = new URL(`../.prism/dist/${file}`, import.meta.url);
	return fs.statSync(url, { throwIfNoEntry: false })?.size ?? 0;
}

export default { components, languages, size, version: pkg.version };
