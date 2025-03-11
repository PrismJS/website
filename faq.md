---js
{
	title: "FAQ",
	tagline: "Frequently Asked Questions, with a few Questions I want people to Frequently Ask.",
	body_classes: "language-none",
	scripts: `
		<script src="https://plugins.prismjs.com/autoloader/prism-autoloader.min.js"></script>
		<script>
			Prism.plugins.autoloader.languages_path = 'https://dev.prismjs.com/components/';
		</script>
		<script src="assets/faq.js"></script>
	`
}
---

<section>

# This page doesn’t work in Opera!

**Prism works fine in Opera.** However, this page might sometimes appear to not be working in Opera, due to the theme switcher triggering an Opera bug. This will be fixed soon.
</section>

<section>

# Isn’t it bad to do syntax highlighting with regular expressions?

It is true that to correctly handle every possible case of syntax found in the wild, one would need to write a full-blown parser. However, in most web applications and websites a small error margin is usually acceptable and a rare highlighting failure is not the end of the world. A syntax highlighter based on regular expressions might only be accurate 99% of the time (the actual percentage is just a guess), but in exchange for the small error margin, it offers some very important benefits:

- Smaller filesize. Proper parsers are very big.
- Extensibility. Authors can define new languages simply by knowing how to code regular expressions. Writing a correct, unambiguous BNF grammar is a task at least an order of magnitude harder.
- Graceful error recovery. Parsers fail on incorrect syntax, where regular expressions keep matching.

For this reason, most syntax highlighters on the web and on desktop, are powered by regular expressions. This includes the internal syntax highlighters used by popular native applications like Espresso and Sublime Text, at the time of writing. Of course, not every regex-powered syntax highlighter is created equal. The number and type of failures can be vastly different, depending on the exact algorithm used. [Prism’s known failures are documented on this page.](known-failures.html).
</section>

<section>

# Why is asynchronous highlighting disabled by default?

Web Workers are good for preventing syntax highlighting of really large code blocks from blocking the main UI thread. In most cases, you will want to highlight reasonably sized chunks of code, and this will not be needed. Furthermore, using Web Workers is actually **slower** than synchronously highlighting, due to the overhead of creating and terminating the Worker. It just appears faster in these cases because it doesn’t block the main thread. In addition, since Web Workers operate on files instead of objects, plugins that hook on core parts of Prism (e.g. modify language definitions) will not work unless included in the same file (using the builder in the [Download](download.html) page will protect you from this pitfall). Lastly, Web Workers cannot interact with the DOM and most other APIs (e.g. the console), so they are notoriously hard to debug.
</section>

<section>

# Why is pre-existing HTML stripped off?

Because it would complicate the code a lot, although it’s not a crucial feature for most people. If it’s very important to you, you can use the [Keep Markup plugin](https://plugins.prismjs.com/keep-markup/).
</section>

<section>

# If pre-existing HTML is stripped off, how can I highlight certain parts of the code?

There is a number of ways around it. You can always break the block of code into multiple parts, and wrap the HTML around it (or just use a `.highlight` class). You can see an example of this in action at the “[Basic usage](index.html#basic-usage)” section of the homepage.

Another way around the limitation is to use the [Line Highlight plugin](https://plugins.prismjs.com/line-highlight/), to highlight and link to specific lines and/or line ranges.
</section>

<section>

# How do I know which tokens I can style for every language?

Every token that is highlighted gets at least two classes: `token` and a class with the token type (e.g. `comment`) plus any number of aliases. Aliases can be seen as additional token types and are used to give specialized tokens a more common class for easier styling. You can find the different types of tokens either by looking at the keys of the object defining the language or by using the below interface.

Language:
<select id="language-select">
{% for id, language in allLanguages -%}
	<option value="{{ id }}" {{ "selected" if loop.first }}>{{ language.title }}</option>
{% endfor %}
</select>
<pre class="language-none" style="height: 30em"><code id="print-tokens-output"></code></pre>

Additionally, you can find a list of standard tokens on [this page](/tokens.html).
</section>

<section>

# How can I use different highlighting for tokens with the same name in different languages?

Just use a descendant selector, that includes the language class. The default `prism.css` does this, to have different colors for JavaScript strings (which are very common) and CSS strings (which are relatively rare). Here’s that code, simplified to illustrate the technique:

```css
.token.string {
	color: #690;
}

.language-css .token.string,
.style .token.string {
	color: #a67f59;
}
```

Abbreviated language classes (e.g. `lang-css`) will be converted to their extended forms, so you don’t need to account for them.

The same technique can be used to differentiate XML tag namespaces from attribute namespaces:

```css
.tag > .token.namespace {
	color: #b37298;
}
.attr-name > .token.namespace {
	color: #ab6;
}
```
</section>
