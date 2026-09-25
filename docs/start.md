---
title: Getting started
tagline: Include Prism in your page, mark up your code, and Prism does the rest.
order: 0
resources:
    - /plugins/keep-markup.js { type="module" }
---

<section class="language-markup">

# Basic usage

You will need to include the `prism.css` and `prism.js` files you [downloaded](/download/) in your page. Example:

<pre><code>&lt;!DOCTYPE html>
&lt;html>
&lt;head>
	...
	<mark>&lt;link href="themes/prism.css" rel="stylesheet" /></mark>
&lt;/head>
&lt;body>
	...
	<mark>&lt;script src="prism.js">&lt;/script></mark>
&lt;/body>
&lt;/html></code></pre>

Prism does its best to encourage good authoring practices. Therefore, it only works with `<code>` elements, since marking up code without a `<code>` element is semantically invalid. [According to the HTML5 spec](https://www.w3.org/TR/html52/textlevel-semantics.html#the-code-element), the recommended way to define a code language is a `language-xxxx` class, which is what Prism uses. Alternatively, Prism also supports a shorter version: `lang-xxxx`.

The [recommended way to mark up a code block](https://www.w3.org/TR/html5/grouping-content.html#the-pre-element) (both for semantics and for Prism) is a `<pre>` element with a `<code>` element inside, like so:

```html
<pre><code class="language-css">p { color: red }</code></pre>
```

If you use that pattern, the `<pre>` will automatically get the `language-xxxx` class (if it doesn’t already have it) and will be styled as a code block.

Inline code snippets are done like this:

```html
<code class="language-css">p { color: red }</code>
```

**Note**: You have to escape all `<` and `&` characters inside `<code>` elements (code blocks and inline snippets) with `&lt;` and `&amp;` respectively, or else the browser might interpret them as an HTML tag or [entity](https://developer.mozilla.org/en-US/docs/Glossary/Entity). If you have large portions of HTML code, you can use the [Unescaped Markup plugin](/plugins/unescaped-markup/) to work around this.

## Language inheritance

To make things easier however, Prism assumes that the language class is inherited. Therefore, if multiple `<code>` elements have the same language, you can add the `language-xxxx` class on one of their common ancestors. This way, you can also define a document-wide default language, by adding a `language-xxxx` class on the `<body>` or `<html>` element.

If you want to opt-out of highlighting a `<code>` element that inherits its language, you can add the `language-none` class to it. The `none` language can also be inherited to disable highlighting for the element with the class and all of its descendants.

If you want to opt-out of highlighting but still use plugins like [Show Invisibles](/plugins/show-invisibles/), use `language-plain` class instead.

## Manual highlighting

If you want to prevent any elements from being automatically highlighted and instead use the [API](/extending/#api-documentation), you can set [`Prism.config.manual`{ .language-javascript }](/api/interfaces/types.PrismConfig.html#manual) to `true`{ .language-javascript } before the `DOMContentLoaded` event is fired. By setting the `data-manual` attribute on the `<script>` element containing Prism core, this will be done automatically. Example:

```html
<script src="prism.js" data-manual></script>
```

or

```html
<script>
window.Prism = window.Prism || {};
window.Prism.manual = true;
</script>
<script src="prism.js"></script>
```

## Usage with CDNs { #basic-usage-cdn }

In combination with CDNs, we recommend using the [Autoloader plugin](/plugins/autoloader) which automatically loads languages when necessary.

The setup of the Autoloader, will look like the following. You can also add your own themes of course.

<pre><code>&lt;!DOCTYPE html>
&lt;html>
&lt;head>
	...
	<mark>&lt;link href="https://{% raw %}{{cdn}}{% endraw %}/prismjs@v1.x/themes/prism.css" rel="stylesheet" /></mark>
&lt;/head>
&lt;body>
	...
	<mark>&lt;script src="https://{% raw %}{{cdn}}{% endraw %}/prismjs@v1.x/components/prism-core.min.js"&gt;&lt;/script&gt;
&lt;script src="https://{% raw %}{{cdn}}{% endraw %}/prismjs@v1.x/plugins/autoloader/prism-autoloader.min.js"&gt;&lt;/script&gt;</mark>
&lt;/body>
&lt;/html></code></pre>

Please note that links in the above code sample serve as placeholders. You have to replace them with valid links to the CDN of your choice.

CDNs which provide PrismJS are e.g. [cdnjs](https://cdnjs.com/libraries/prism), [jsDelivr](https://www.jsdelivr.com/package/npm/prismjs), and [UNPKG](https://unpkg.com/browse/prismjs@1/).

## Usage with Webpack, Browserify, & Other Bundlers { #basic-usage-bundlers }

If you want to use Prism with a bundler, install Prism with `npm`:

```bash
$ npm install prismjs
```

You can then `import` into your bundle:

```js
import Prism from "prismjs";
```

To make it easy to configure your Prism instance with only the languages and plugins you need, use the babel plugin, [babel-plugin-prismjs](https://github.com/mAAdhaTTah/babel-plugin-prismjs). This will allow you to load the minimum number of languages and plugins to satisfy your needs. See that plugin's documentation for configuration details.

## Usage with Node { #basic-usage-node }

If you want to use Prism on the server or through the command line, Prism can be used with Node.js as well. This might be useful if you're trying to generate static HTML pages with highlighted code for environments that don't support browser-side JS, like [AMP pages](https://www.ampproject.org/).

Example:

```js
const Prism = require("prismjs");

// The code snippet you want to highlight, as a string
const code = `var data = 1;`;

// Returns a highlighted HTML string
const html = Prism.highlight(code, Prism.languages.javascript, "javascript");
```

Requiring `prismjs` will load the default languages: `markup`, `css`, `clike` and `javascript`. You can load more languages with the `loadLanguages()`{ .language-javascript } utility, which will automatically handle any required dependencies.

Example:

```js
const Prism = require("prismjs");
const loadLanguages = require("prismjs/components/");
loadLanguages(["haml"]);

// The code snippet you want to highlight, as a string
const code = `= ['hi', 'there', 'reader!'].join " "`;

// Returns a highlighted HTML string
const html = Prism.highlight(code, Prism.languages.haml, "haml");
```

**Note**: Do _not_ use `loadLanguages()`{ .language-javascript } with Webpack or another bundler, as this will cause Webpack to include all languages and plugins. Use the babel plugin described above.

**Note**: `loadLanguages()`{ .language-javascript } will ignore unknown languages and log warning messages to the console. You can prevent the warnings by setting `loadLanguages.silent = true`{ .language-javascript }.

</section>
