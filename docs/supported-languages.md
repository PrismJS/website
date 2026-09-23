---
title: Supported languages
tagline: Every language Prism highlights, and the classes that select it.
---

<section class="language-markup">

This is the list of all {{ prism.languages | length }} languages currently supported by Prism, with their corresponding alias, to use in place of `xxxx` in the `language-xxxx` (or `lang-xxxx`) class:

<ul id="languages-list">
	{% for id, language in prism.languages -%}
	<li data-id="{{ id }}">
		{{ language.title }}&nbsp;—<code>{{ id }}</code>
		{%- for alias, title in language.aliasTitles -%}
			, <code>{{ alias }}</code>
		{%- endfor %}
	</li>
	{% endfor %}
</ul>

Couldn’t find the language you were looking for? [Request it](https://github.com/PrismJS/prism/issues)!

</section>
