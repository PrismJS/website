---
title: Plugins
tagline: Additional scripts and styles that extend Prism’s functionality. Many are official, released separately to keep Prism core small for those who don’t need them.
permalink: /plugins/
parentOf: plugin
---

<ul class="plugin-list">
	{% for plugin in collections.plugin -%}
	{%- set meta = plugin.data -%}
	<li>
		<a href="/plugins/{{ meta.id }}">{{ meta.title | md }}</a>
		<div>{{ meta.description | md }}</div>
	</li>
	{% endfor -%}
</ul>

No assembly required to use them. Just select them in the [download](/download/) page.

It’s very easy to [write your own Prism plugins](/extending/#writing-plugins). Did you write a plugin for Prism that you want added to this list? [Send a pull request](https://github.com/PrismJS/plugins/)!
