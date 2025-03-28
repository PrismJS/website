---
tagline: "The examples in this page serve a dual purpose: They act as unit tests, making it easy to spot bugs, and at the same time demonstrate what Prism can do, on simple and on edge cases."
resources:
  - assets/examples.js { type="module" }
  - https://plugins.prismjs.com/autoloader/prism-autoloader.js { data-autoloader-path="https://dev.prismjs.com/components/" }
---

<section class="language-markup">

# Different markup

## code.language-css

`p { color: red; }`{ .language-css }

## pre.language-css > code

```css
p { color: red; }
```

## pre > code.language-css

<pre><code class="language-css">p { color: red; }</code></pre>

## pre.language-css > code.language-\*

<pre class="language-css"><code class="language-*">p { color: red; }</code></pre>

## code.lang-css

`p { color: red; }`{ .lang-css }

## pre.lang-css > code

```{ .lang-css }
p { color: red; }
```

## pre > code

No language, should inherit `.language-markup`

```
<p>hi!</p>
```

## code.language-\*

No language, should inherit `.language-markup`

`<p>hi!</p>`{ .language-* }

## code.language-none

Should not be highlighted.

`<p>hi!</p>`{ .language-none }
</section>

<section>

# Per language examples

<div id="languages">
	{% for id, language in languages -%}
	<label data-id="{{ id }}">
		<input type="checkbox" name="language" value="{{ id }}" {{ "checked" if language.option == "default" }} /> {{ language.title }}
	</label>
	{% endfor %}
</div>
</section>

<section id="examples">
{% for id, language in languages -%}
	<section id="language-{{ id }}" class="language-{{ id }}"></section>
{% endfor %}
</section>
