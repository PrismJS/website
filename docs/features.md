---
title: Features
tagline: Everything Prism does, and the few things it doesn’t.
---

<section class="language-markup">

# Full list of features

- **Only 2KB** minified & gzipped (core). Each language definition adds roughly 300-500 bytes.
- Encourages good author practices. Other highlighters encourage or even force you to use elements that are semantically wrong, like `<pre>` (on its own) or `<script>`. Prism forces you to use the correct element for marking up code: `<code>`. On its own for inline code, or inside a `<pre>` for blocks of code. In addition, the language is defined through the way recommended in the HTML5 draft: through a `language-xxxx` class.
- The `language-xxxx` class is inherited. This means that if multiple code snippets have the same language, you can just define it once, in one of their common ancestors.
- Supports **parallelism with Web Workers**, if available. Disabled by default ([why?](/faq/#why-is-asynchronous-highlighting-disabled-by-default)).
- Very easy to extend without modifying the code, due to Prism’s [plugin architecture](/plugins/). Multiple hooks are scattered throughout the source.
- Very easy to [define new languages](/extending/#language-definitions). The only thing you need is a good understanding of regular expressions.
- All styling is done through CSS, with [sensible class names](/faq/#how-do-i-know-which-tokens-i-can-style-for) rather than ugly, namespaced, abbreviated nonsense.
- Wide browser support: Edge, IE11, Firefox, Chrome, Safari, [Opera](/faq/#this-page-doesnt-work-in-opera), most mobile browsers.
- Highlights embedded languages (e.g. CSS inside HTML, JavaScript inside HTML).
- Highlights inline code as well, not just code blocks.
- It doesn’t force you to use any Prism-specific markup, not even a Prism-specific class name, only standard markup you should be using anyway. So, you can just try it for a while, remove it if you don’t like it and leave no traces behind.
- Highlight specific lines and/or line ranges (requires [plugin](/plugins/line-highlight/)).
- Show invisible characters like tabs, line breaks etc (requires [plugin](/plugins/show-invisibles/)).
- Autolink URLs and emails, use Markdown links in comments (requires [plugin](/plugins/autolinker/)).

</section>

<section>

# Limitations

- Any pre-existing HTML in the code will be stripped off. [There are ways around it though](/faq/#if-pre-existing-html-is-stripped-off-how-can-i-highlight).
- Regex-based so it \*will\* fail on certain edge cases, which are documented in the [known failures page](/known-failures/).
- Some of our themes have problems with certain layouts. Known cases are documented [here](/known-failures/#themes).
- No IE 6-10 support. If someone can read code, they are probably in the 95% of the population with a modern browser.

</section>
