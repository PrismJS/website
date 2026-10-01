import { execSync } from "node:child_process";

// Prism's default branch changes when v2 is released, so edit links take it from the clone postinstall made
const branch = execSync("git branch --show-current", { cwd: ".prism", encoding: "utf8" }).trim();

export default {
	tags: ["plugin"],
	eleventyComputed: {
		// The plugin directory the page is imported into
		id: data => data.page.filePathStem.split("/")[2],

		// The plugin comes before the page's own demo.js, which builds on it
		resources: data => [
			`/plugins/${data.id}.js`,
			...(data.noCSS ? [] : [`/plugins/${data.id}.css`]),
			...[data.resources ?? []].flat(),
		],

		// A README is the plugin's page; a demo keeps the .html URL its README fetches it by
		permalink: data =>
			data.page.fileSlug === "README"
				? data.page.filePathStem.replace(/README$/, "index.html")
				: `${data.page.filePathStem}.html`,

		// These pages are imported from the Prism repo, so that is where edits go
		editLink: data =>
			`https://github.com/PrismJS/prism/edit/${branch}/src/plugins/${data.page.inputPath.split("/plugins/").pop()}`,
	},
};
