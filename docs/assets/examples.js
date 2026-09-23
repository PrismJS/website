/**
 * Manage examples
 */

import Prism from "./prism.js";
import { toArray, getFileContents } from "./util.js";

let components = await (await fetch("/components.json")).json();
let languages = components.languages;
let examples = {};

// FIXME: Switch to the main branch when the Prism v2 is released
let treeURL = "https://api.github.com/repos/PrismJS/website/git/trees/v2?recursive=1";
let tree = (await (await fetch(treeURL)).json()).tree;

async function fileExists (filepath) {
	for (let i = 0, l = tree.length; i < l; i++) {
		if (tree[i].path === filepath) {
			return true;
		}
	}

	// on localhost: The missing example might be for a new language
	if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
		try {
			await getFileContents("/" + filepath);
			return true;
		}
		catch (error) {
			return false;
		}
	}
	return false;
}

function buildContentsHeader (id) {
	let language = languages[id];
	// h2: the page already has its own <h1>, and this sits inside a section of it
	let header = `<h2>${language.title}</h2>`;
	if (language.aliasTitles) {
		let alias = Object.keys(language.aliasTitles);
		header += "<p>To use this language, use one of the following classes:</p>";
		header += `<ul><li><code class="language-none">"language-${id}"</code></li>`;
		alias.forEach(alias => {
			header += `<li><code class="language-none">"language-${alias}"</code></li>`;
		});
		header += "</ul>";
	}
	else {
		header += `<p>To use this language, use the class <code class="language-none">"language-${id}"</code>.</p>`;
	}
	function wrapCode (text) {
		return `<code class="language-none">${text}</code>`;
	}
	let deps = [];
	if (language.require) {
		deps.push("requires " + toArray(language.require).map(wrapCode).join(", "));
	}
	if (language.optional) {
		deps.push("optionally uses " + toArray(language.optional).map(wrapCode).join(", "));
	}
	if (language.modify) {
		deps.push("modifies " + toArray(language.modify).map(wrapCode).join(", "));
	}
	if (deps.length) {
		header += "<p>";
		header += `<a href="/extending/#dependencies"><strong>Dependencies:</strong></a>`;
		header += " This component";
		if (deps.length === 1) {
			header += ` ${deps[0]}.`;
		}
		else {
			header += ":";
			header += "<ul>";
			deps.forEach(text => {
				header += `<li>${text}.</li>`;
			});
			header += "</ul>";
		}
		header += "</p>";
	}
	return header;
}

async function update (id) {
	let language = languages[id];
	if (language.enabled) {
		// Leading slash: examplesPath is a repo path, and this page is served from /examples/
		let contents = await getFileContents("/" + language.examplesPath);

		/** @type {HTMLElement} */
		let container = examples[id];
		container.innerHTML = buildContentsHeader(id) + contents;

		for (let pre of container.querySelectorAll("pre")) {
			// An example file may name its own language, as OpenCL's does with cpp
			let language = pre.className.match(/language-([\w-]+)/)?.[1] ?? id;

			// The language might extend another, so depend on the current one explicitly
			pre.dataset.dependencies = [pre.dataset.dependencies, id].filter(Boolean).join(",");
			pre.className = `language-${language}`;
		}

		Prism.highlightAll({ root: container });
	}
	else {
		examples[id].innerHTML = "";
	}
}

let languagesSection = document.querySelector("#languages");
let examplesSection = document.querySelector("#examples");

let res = await Promise.all(
	Object.keys(languages)
		.filter(id => id !== "meta")
		.map(async id => {
			let language = languages[id];

			language.enabled = language.option === "default";
			language.path = languages.meta.path.replace(/\{id\}/g, id) + ".js";
			language.examplesPath = languages.meta.examplesPath.replace(/\{id\}/g, id) + ".html";
			let exists = await fileExists(language.examplesPath);
			return { id, exists };
		}),
);

res.forEach(async ({ id, exists }) => {
	let language = languages[id];
	let label = languagesSection.querySelector(`label[data-id="${id}"]`);
	let input = label.children[0];

	if (!exists) {
		label.title = "No examples are available for this language";
		label.classList.add("unavailable");
		input.disabled = true;
		input.checked = false;
	}
	else {
		input.addEventListener("change", async () => {
			let inputs = languagesSection.querySelectorAll(`input[name="language"]`);
			inputs.forEach(input => {
				languages[input.value].enabled = input.checked;
			});
			await update(id);
		});
	}

	examples[id] = examplesSection.querySelector(`#language-${id}`);

	if (language.enabled) {
		await update(id);
	}
});
