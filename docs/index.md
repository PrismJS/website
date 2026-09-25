---
layout: landing
hero:
    title: Prism
    tagline: A lightweight, robust, and elegant syntax highlighting library.
    image: /assets/logo.svg
    actions:
        - text: Get started
          href: /start/
        - text: API Docs
          href: /api/
        - text: GitHub
          href: https://github.com/PrismJS/prism
          icon: github
features:
    - icon: 🎯
      title: Dead simple
      description: Include prism.css and prism.js, use proper HTML5 code tags (`code.language-xxxx`), done!
      href: /start/
    - icon: 🧠
      title: Intuitive
      description: Language classes are inherited so you can only define the language once for multiple code snippets.
      href: /start/#language-inheritance
    - icon: 🪶
      title: Light as a feather
      description: The core is 2KB minified & gzipped. Languages add 0.3-0.5KB each, themes are around 1KB.
      href: /features/
    - icon: ⚡
      title: Blazing fast
      description: Supports parallelism with Web Workers, if available.
      href: /faq/#why-is-asynchronous-highlighting-disabled-by-default
    - icon: 🧩
      title: Extensible
      description: Define new languages or extend existing ones. Add new features thanks to Prism's plugin architecture.
      href: /plugins/
    - icon: 🎨
      title: Easy styling
      description: All styling is done through CSS, with sensible class names like `.comment`, `.string`, `.property` etc.
      href: /tokens/
---

<section>

# Three steps to highlighted code

<ol class="steps">
<li>

## Get Prism

[Download](/download/) `prism.js` and `prism.css` with just the languages and plugins you need, or [load them from a CDN](/start/#basic-usage-cdn).

</li>
<li>

## Include it in your page

```html
<link href="prism.css" rel="stylesheet" />
<script src="prism.js"></script>
```

</li>
<li>

## Mark up your code

```html
<pre><code class="language-css">p { color: red }</code></pre>
```

Prism finds it on load and highlights it. The class is [inherited](/start/#language-inheritance), so one on a common ancestor covers every snippet inside.

</li>
</ol>

That’s it. Read the [full walkthrough](/start/), see [what else Prism does](/features/), or [try it out for yourself](/test/).

</section>

<section>

# Used By

Prism is used on several websites, small and large. Some of them are:

<div class="used-by-logos">
	<a href="https://www.smashingmagazine.com/" target="_blank"><img src="assets/img/logo-smashing.png" alt="Smashing Magazine" /></a>
	<a href="https://alistapart.com/" target="_blank"><img src="assets/img/logo-ala.png" alt="A List Apart" /></a>
	<a href="https://developer.mozilla.org/" target="_blank"><img src="assets/img/logo-mdn.png" alt="Mozilla Developer Network (MDN)" /></a>
	<a href="https://css-tricks.com/" target="_blank"><img src="assets/img/logo-css-tricks.png" alt="CSS-Tricks" /></a>
	<a href="https://www.sitepoint.com/" target="_blank"><img src="assets/img/logo-sitepoint.png" alt="SitePoint" /></a>
	<a href="https://www.drupal.org/" target="_blank"><img src="assets/img/logo-drupal.png" alt="Drupal" /></a>
	<a href="https://reactjs.org/" target="_blank"><img src="assets/img/logo-react.png" alt="React" /></a>
	<a href="https://stripe.com/" target="_blank"><img src="assets/img/logo-stripe.png" alt="Stripe" /></a>
	<a href="https://dev.mysql.com/" target="_blank"><img src="assets/img/logo-mysql.png" alt="MySQL" /></a>
</div>

</section>

<section>

# Credits

- Special thanks to [Michael Schmidt](https://github.com/RunDevelopment), [James DiGioia](https://github.com/mAAdhaTTah), [Golmote](https://github.com/Golmote) and [Jannik Zschiesche](https://github.com/apfelbox) for their contributions and for being **amazing maintainers**. Prism would not have been able to keep up without their help.
- To [Roman Komarov](https://twitter.com/kizmarh) for his contributions, feedback and testing.
- To [Zachary Forrest](https://twitter.com/zdfs) for [coming up with the name “Prism”](https://twitter.com/zdfs/statuses/217834980871639041).
- To [Jason Hobbs](https://twitter.com/thecodezombie) for [encouraging me](https://twitter.com/thecodezombie/status/217663703825399809) to release this script as standalone.

</section>
