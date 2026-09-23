export default {
	tags: ["plugin"],
	eleventyComputed: {
		// The directory postinstall copied the page into
		id: data => data.page.filePathStem.split("/")[2],

		// The plugin comes before the page's own demo.js, which builds on it
		resources: data => [
			`/plugins/${data.id}.js { type="module" }`,
			...(data.noCSS ? [] : [`/plugins/${data.id}.css`]),
			...[data.resources ?? []].flat(),
		],

		// A README is the plugin's page; a demo keeps the .html URL its README fetches it by
		permalink: data =>
			data.page.fileSlug === "README"
				? data.page.filePathStem.replace(/README$/, "index.html")
				: `${data.page.filePathStem}.html`,

		// These pages are copied from the Prism repo by postinstall, so that is where edits go
		// FIXME: Switch to the main branch when Prism v2 is released
		editLink: data =>
			`https://github.com/PrismJS/prism/edit/v2/src/plugins/${data.page.inputPath.split("/plugins/").pop()}`,
	},
};
