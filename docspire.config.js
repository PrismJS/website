import markdownItDeflist from "markdown-it-deflist";
import landing from "docspire/plugins/landing";
import { parse_resources, pretty_size } from "./_build/filters.js";

export default {
	title: "Prism",
	description: "A lightweight, robust, and elegant syntax highlighting library.",
	icon: "/assets/logo.svg",
	repo: "https://github.com/PrismJS/prism",
	editLink: {
		// Netlify names the branch it builds, so a page links to the copy it was built from
		pattern: `https://github.com/PrismJS/website/edit/${process.env.HEAD ?? "main"}/:path`,
	},
	deleteOutput: true,
	// The plugin pages live in the Prism repo, next to each plugin's code
	import: {
		".prism/src/plugins/:id/:page.md": "plugins/:id/:page.md",
	},
	// markdown-it-prism highlights with Prism v1. Prism v2 highlights in the browser instead.
	md: { prism: false },
	plugins: [
		landing,
		{
			url: import.meta.url,
			scripts: "/assets/prism.js",
			slotted: { "content.start": "page-title", "content.end": "resources" },
			plugin (config) {
				config.addPageTransform(function (tree) {
					tree.match("body", node => {
						node.attrs ??= {};

						// Prism reads the language it inherits off an ancestor
						if (this.data.body_classes) {
							node.attrs.class = [node.attrs.class, this.data.body_classes]
								.filter(Boolean)
								.join(" ");
						}

						// brand.css scopes each page's own rules by this name, as in [data-page="tokens"].
						// The name has no file extension, so a page keeps its styles when it changes format.
						node.attrs["data-page"] = this.page.filePathStem.slice(1);

						return node;
					});
				});

				// Netlify reads _headers at the publish root, and it lives outside docs/
				config.addPassthroughCopy("_headers");

				// The html-relative passthrough that ships the rest skips root-relative URLs
				config.addPassthroughCopy({ "docs/assets": "assets" });

				// Fetched at runtime, so nothing else copies them: .html is not a template format here
				config.addPassthroughCopy({
					// Outside docs/: the examples page finds them by this path in the repo's tree
					examples: "examples",
				});

				// Prism's build, at the URLs its docs give, like /themes/prism.css. The bundles import
				// their chunks as "../global-….js", so the chunks go to the root too.
				config.addPassthroughCopy({ ".prism/dist": "." }, { filter: ["**", "!cjs/**"] });

				// The sources plugin demos show, like /plugins/toolbar/toolbar.js
				config.addPassthroughCopy(
					{ ".prism/src/plugins": "plugins" },
					{ filter: ["*/*.js", "*/*.css"] },
				);

				config.addFilter("pretty_size", pretty_size);
				config.addFilter("parse_resources", parse_resources);

				config.amendLibrary("md", md => {
					md.use(markdownItDeflist);

					// A fence's attributes go on the <pre>, where Prism's plugins read them:
					// ```html { data-line="2" } → <pre data-line="2"><code class="language-html">
					let fence = md.renderer.rules.fence;
					md.renderer.rules.fence = (tokens, index, options, env, renderer) => {
						let token = tokens[index];
						let attrs = renderer.renderAttrs(token);
						token.attrs = null;

						return fence(tokens, index, options, env, renderer).replace(
							"<pre",
							"<pre" + attrs,
						);
					};
				});
			},
		},
	],
};
