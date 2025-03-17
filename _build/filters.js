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
	return content.replace(/<\/section>/g, `<p><a href="#toc">↑ Back to top</a></p></section>`);
}

export function pretty_size (size) {
	return Math.round(100 * size / 1024) / 100 + "KB";
}
