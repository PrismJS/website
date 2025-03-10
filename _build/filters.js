import * as path from "path";

export function relative (page) {
	if (!page.url) {
		return "";
	}

	let pagePath = page.url.replace(/[^/]+$/, "");
	let ret = path.relative(pagePath, "/");

	return ret || ".";
}
