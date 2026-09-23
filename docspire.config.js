import * as path from "path";
import markdownItDeflist from "markdown-it-deflist";
import landing from "docspire/plugins/landing";
import { parse_resources, pretty_size } from "./_build/filters.js";

// Each page's `body_classes`, by input path. The page transform that edits <body> can't read
// front matter, only the page's path. So a content read, which can, stores them here first.
const bodyClasses = new Map();

export default {
	title: "Prism",
	description: "A lightweight, robust, and elegant syntax highlighting library.",
	logo: "/assets/logo.svg",
	icon: "/assets/logo.svg",
	repo: "https://github.com/PrismJS/prism",
	editLink: {
		pattern: "https://github.com/PrismJS/website/edit/main/:path",
	},
	deleteOutput: true,
	// markdown-it-prism highlights with Prism v1. Prism v2 highlights in the browser instead.
	md: { prism: false },
	plugins: [
		landing,
		{
			url: import.meta.url,
			styles: "brand.css",
			scripts: "/assets/prism.js",
			slotted: { "content.start": "page-title", "content.end": "resources" },
			data: {
				// The layout titles every page with an h1, so the Markdown under it starts a level
				// lower. The pages, and the plugin READMEs from the Prism repo, open sections at #.
				headingOffset: 1,
			},
			plugin (config) {
				// 11ty skips gitignored files, and the plugin docs are generated.
				config.setUseGitIgnore(false);

				config.addPageTransform(function (tree) {
					let bodyClass = bodyClasses.get(this.inputPath);

					tree.match("body", node => {
						node.attrs ??= {};

						// Prism reads the language it inherits off an ancestor
						if (bodyClass) {
							node.attrs.class = [node.attrs.class, bodyClass]
								.filter(Boolean)
								.join(" ");
						}

						// What brand.css hooks its page-specific rules on: the input path, as in
						// "plugins/toolbar/README.md". The stem is relative to the input directory
						node.attrs["data-inputpath"] =
							this.page.filePathStem.slice(1) + path.extname(this.inputPath);

						return node;
					});
				});

				// Netlify reads _headers at the publish root, and it lives outside docs/
				config.addPassthroughCopy({ _headers: "_headers" });

				// The html-relative passthrough that ships the rest skips root-relative URLs
				config.addPassthroughCopy({ "docs/assets": "assets" });

				// Fetched at runtime, so nothing else copies them: 11ty reads .json as data,
				// and .html is not a template format here
				config.addPassthroughCopy({
					"docs/components.json": "components.json",
					"docs/file-sizes.json": "file-sizes.json",
					// Outside docs/: the examples page finds them by this path in the repo's tree
					examples: "examples",
				});

				config.addFilter("pretty_size", pretty_size);
				config.addFilter("parse_resources", parse_resources);

				config.amendLibrary("md", md => {
					md.use(markdownItDeflist);

					// A page's `headingOffset` moves every Markdown heading that many levels down
					md.core.ruler.push("heading_offset", ({ env, tokens }) => {
						if (!env?.headingOffset) {
							return;
						}

						for (let token of tokens) {
							if (token.type === "heading_open" || token.type === "heading_close") {
								let level = Math.min(
									Number(token.tag.slice(1)) + env.headingOffset,
									6,
								);
								token.tag = `h${level}`;
							}
						}
					});

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

				// A long page repeats this at the end of every section. "top" is the fragment
				// the HTML spec reserves for the top of the document.
				config.addContentTransform(function (tree) {
					if (this.back_to_top) {
						tree.match({ tag: "section" }, node => {
							node.content.push(
								`<p><a href="#top" class="back-to-top">↑ Back to top</a></p>`,
							);
							return node;
						});
					}

					return tree;
				});

				// The language its code is written in, for Prism in the browser
				config.addContentRead(function () {
					bodyClasses.set(this.page.inputPath, this.body_classes);
				});
			},
		},
	],
};
