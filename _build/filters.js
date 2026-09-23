export function pretty_size (size) {
	return Math.round((100 * size) / 1024) / 100 + "KB";
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
		if (url.startsWith("/languages/")) {
			// A language module only exports its definition, so a plain <script src> registers nothing.
			// Import it and add it to Prism's registry by hand
			ret.push(
				`<script type="module" ${attributes}>import Prism from "/assets/prism.js"; import language from "${url}"; Prism.languageRegistry.add(language);</script>`,
			);
		}
		else if (extension === "js" || extension === "mjs") {
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
