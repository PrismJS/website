import markdownItAnchor from "markdown-it-anchor";
import markdownItAttrs from "markdown-it-attrs";
import markdownItDeflist from "markdown-it-deflist";
import pluginTOC from "eleventy-plugin-toc";
import * as filters from "./filters.js";

export default config => {
	let data = {
		layout: "page.njk",
		theme_switcher: true,
		permalink: `{{ "index" if page.filePathStem == "/README" else page.filePathStem }}.html`,
	};

	for (let p in data) {
		config.addGlobalData(p, data[p]);
	}

	for (let f in filters) {
		config.addFilter(f, filters[f]);
	}

	let mdLib;
	config.amendLibrary("md", md => {
		mdLib = md;
		md.options.typographer = true;
		md.options.linkify = true;
		md.use(markdownItAnchor, {
			permalink: markdownItAnchor.permalink.headerLink(),
		});
		md.use(markdownItAttrs);
		md.use(markdownItDeflist);

		// Allow setting attributes on the outer <pre>, not the inner <code>
		md.renderer.rules.fence = function (tokens, idx, options, env, slf) {
			let token = tokens[idx];
			let lang = token.info ? `class="language-${token.info}"` : "";
			let content = md.utils.escapeHtml(token.content).trim();
			return `<pre ${slf.renderAttrs(token)}><code ${lang}>${content}</code></pre>`;
		};
	});

	config.addFilter("md_inline", content => {
		return mdLib.renderInline(content);
	});

	config.addPlugin(pluginTOC, {
		tags: ["h1", "h2", "h3"],
		ul: true,
	});

	return {
		markdownTemplateEngine: "njk",
		templateFormats: ["md", "njk"],
		dir: {
			layouts: "_layouts",
			output: ".",
		},
	};
};
