---
title: Test drive
tagline: Take Prism for a spin!
resources:
  body:
    - assets/test-drive.js
    - <script> Prism.plugins.autoloader.use_minified = false; </script>
---


<section>
	<form>
		<p>
			<textarea>&lt;p class="hey">Type some code here&lt;/p></textarea>
		</p>
		<p>Result:</p>
		<pre><code></code></pre>
		<div id="options" style="margin: 1em 0">
			<label><input type="checkbox" id="option-show-tokens"> Show tokens </label>
			<div class="link-wrapper">
				<a id="share-link" href="" style="float: right;"> Share </a>
				<div class="hidden-wrapper">
					<input id="share-link-input" type="text" readonly />
					<button type="button" id="copy-share-link">Copy to clipboard</button>
				</div>
			</div>
		</div>
		<p id="language">
			<strong>Language:</strong>
			{% for id, language in languages -%}
			<label data-id="{{ id }}">
				<input type="radio" name="language" value="{{ id }}" /> {{ language.title }}
			</label>
			{% endfor -%}
		</p>
	</form>
</section>
