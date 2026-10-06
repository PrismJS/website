/**
 * Manage examples
 */

import Prism from "./prism.js";
import { getFileContents } from "./util.js";

// Ids of the languages whose example file is fetched or on its way
let loaded = new Set();

async function update ({ value: id, checked }) {
	let section = document.querySelector(`#language-${id}`);
	section.hidden = !checked;

	if (!checked || loaded.has(id)) {
		return;
	}

	loaded.add(id);
	section.insertAdjacentHTML("beforeend", await getFileContents(`/examples/${id}.html`));

	for (let pre of section.querySelectorAll("pre")) {
		// An example file may name its own language, as OpenCL's does with cpp
		let language = pre.className.match(/language-([\w-]+)/)?.[1] ?? id;

		// The language might extend another, so depend on the current one explicitly
		pre.dataset.dependencies = [pre.dataset.dependencies, id].filter(Boolean).join(",");
		pre.className = `language-${language}`;
	}

	Prism.highlightAll({ root: section });
}

// The build disables the languages that have no example file
for (let input of document.querySelectorAll(`#languages input:enabled`)) {
	input.addEventListener("change", () => update(input));
	update(input);
}
