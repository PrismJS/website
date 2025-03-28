import * as path from "path";

export function relative (page) {
	if (!page.url) {
		return "";
	}

	let pagePath = page.url.replace(/[^/]+$/, "");
	let ret = path.relative(pagePath, "/");

	return ret || ".";
}

export function back_to_top (content) {
	// Add “↑ Back to top” at the end of each `<section>`
	return content.replace(/<\/section>/g, `<p><a href="#toc" class="back-to-top">↑ Back to top</a></p></section>`);
}

export function pretty_size (size) {
	return Math.round(100 * size / 1024) / 100 + "KB";
}

export function parse_resources (resources = []) {
	let ret = [];

	resources = Array.isArray(resources) ? resources : [resources];
	for (let resource of resources) {
		resource = resource.trim();
		let url = resource;

		// Attributes are defined as in markdown-it-attrs but we don't parse them and use them as-is.
		// For example: `{ data-autoloader-path="https://dev.prismjs.com/components/" }`
		let attributes = resource.match(/\{.*\}$/)?.[0];
		if (!attributes) {
			attributes = "";
		}
		else {
			url = url.replace(attributes, "").trim();
			attributes = attributes.slice(1, -1).trim(); // remove the curly braces
		}

		let extension = url.match(/\.([^.]+)$/)?.[1];
		if (extension === "js" || extension === "mjs") {
			ret.push(`<script src="${url}" ${attributes}></script>`);
		}
		else if (extension === "css") {
			ret.push(`<link rel="stylesheet" href="${url}" ${attributes} />`);
		}
		else {
			// Raw HTML
			ret.push(url);
		}
	}

	return ret;
}
