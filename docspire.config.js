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
			styles: "brand.css",
			scripts: ["/assets/prism.js", "/assets/theme-switcher.js"],
			slotted: {
				"nav.start": "theme-switcher",
				"content.start": "page-title",
				"content.end": "resources",
				"content.after.end": "site-footer",
			},
			icons: {
				// Bootstrap Icons: palette
				palette: `
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-palette" viewBox="0 0 16 16">
						<path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3M5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
						<path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8m-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7"/>
					</svg>
				`,
			},
			data: {
				// The layout titles every page with an h1, so the Markdown under it starts a level
				// lower. The pages, and the plugin READMEs from the Prism repo, open sections at #.
				headingOffset: 1,
			},
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
			},
		},
	],
};
