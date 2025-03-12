---
tagline: A list of rare edge cases where Prism highlights code incorrectly.
body_classes: language-none
toc_classes: static
scripts: <script src="https://plugins.prismjs.com/autoloader/prism-autoloader.js" data-autoloader-path="https://dev.prismjs.com/components/"></script>
---

There are certain edge cases where Prism will fail. There are always such cases in every regex-based syntax highlighter.  
However, Prism dares to be open and honest about them. If a failure is listed here, it doesn’t mean it will never be fixed. This is more of a “known bugs” list, just with a certain type of bug.

{% for failure in knownFailures -%}
{% set lang = failure.language %}
{% set issues = failure.failures %}
<section class="language-{{ lang }}">
	<h1 id="{{ lang }}">
		<a href="#{{ lang }}">{{ allLanguages[lang].title }}</a>
	</h1>
	{% for issue in issues -%}
	<h3>{{ issue.heading | md_inline | safe }}</h3>
	{% if issue.description -%}
	<p>{{ issue.description | md_inline | safe }}</p>
	{% endif %}
	{%- for example in issue.examples -%}
	<pre><code>{{ example | safe | nl2br }}</code></pre>
	{% endfor -%}
	{% endfor -%}
	<p><a href="#toc">↑ Back to top</a></p>
</section>
{% endfor -%}

<section>

# Themes

Some of our themes are not compatible with certain layouts.

## Coy

Coy's shadows and background might not wrap around the code correctly if combined with float of flexbox layouts.

![](assets/img/failures/coy-overlap.png)

### Workarounds

There are 2 possible workarounds:

The first workaround is setting `display: flex-root;` for the `pre` element. This will fix the issue but `flex-root` has [limited browser support](https://caniuse.com/#feat=flow-root).

The second is adding `clear: both;` to the style of the `pre` element. This will fix the issue but it will change the way code blocks behave when overlapping with other elements.

[↑ Back to top](#toc)
</section>
