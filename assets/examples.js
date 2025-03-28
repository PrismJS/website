/**
 * Manage examples
 */

import { toArray, getFileContents } from "./util.js";

let components = await (await fetch("https://dev.prismjs.com/components.json")).json();
let languages = components.languages;
let examples = {};

// TODO: Replace with "https://api.github.com/repos/PrismJS/website/git/trees/main?recursive=1" when the website is launched
let treeURL = "https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1";
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
			await getFileContents(filepath);
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
	let header = `<h1>${ language.title }</h1>`;
	if (language.alias) {
		let alias = toArray(language.alias);
		header += "<p>To use this language, use one of the following classes:</p>";
		header += `<ul><li><code class="language-none">"language-${ id }"</code></li>`;
		alias.forEach(alias => {
			header += `<li><code class="language-none">"language-${ alias }"</code></li>`;
		});
		header += "</ul>";
	}
	else {
		header +=
			`<p>To use this language, use the class <code class="language-none">"language-${ id }"</code>.</p>`;
	}
	function wrapCode (text) {
		return `<code class="language-none">${ text }</code>`;
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
		header += `<a href="extending.html#dependencies"><strong>Dependencies:</strong></a>`;
		header += " This component";
		if (deps.length === 1) {
			header += ` ${ deps[0] }.`;
		}
		else {
			header += ":";
			header += "<ul>";
			deps.forEach(text => {
				header += `<li>${ text }.</li>`;
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
		let contents = await getFileContents(language.examplesPath);
		examples[id].innerHTML = buildContentsHeader(id) + contents;

		/** @type {HTMLElement} */
		let container = examples[id];
		container.innerHTML = buildContentsHeader(id) + contents;

		// the current language might be an extension of a language
		// so to be safe, we explicitly add a dependency to the current language
		container.querySelectorAll("pre").forEach(
			/** @param {HTMLElement} pre */ pre => {
				let dependencies = (pre.getAttribute("data-dependencies") || "").trim();
				dependencies = dependencies ? dependencies + "," + id : id;
				pre.setAttribute("data-dependencies", dependencies);
			},
		);

		Prism.highlightAllUnder(container);
	}
	else {
		examples[id].innerHTML = "";
	}
}

let languagesSection = document.querySelector("#languages");
let examplesSection = document.querySelector("#examples");

let res = await Promise.all(Object.keys(languages)
	.filter(id => id !== "meta")
	.map(async id => {
		let language = languages[id];

		language.enabled = language.option === "default";
		language.path = languages.meta.path.replace(/\{id\}/g, id) + ".js";
		language.examplesPath = languages.meta.examplesPath.replace(/\{id\}/g, id) + ".html";
		let exists = await fileExists(language.examplesPath);
		return { id, exists };
	}));

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
