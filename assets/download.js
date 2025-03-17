/**
 * Manage downloads
 */

import { getFileContents, toArray } from "./util.js";

let components = await (await fetch("https://dev.prismjs.com/components.json")).json();

let treeURL = "https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1";
let tree = (await (await fetch(treeURL)).json()).tree;

let cache = {};
let form = document.querySelector("form");
let minified = true;

let dependencies = {};
let timerId = 0;
let storedTheme = localStorage.getItem("theme");

let hstr = location.hash.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
if (hstr) {
	hstr.forEach(function (str) {
		let kv = str.split("=", 2);
		let category = kv[0];
		let ids = kv[1].split("+");
		if (category !== "meta" && category !== "core" && components[category]) {
			for (let id in components[category]) {
				if (components[category][id].option) {
					delete components[category][id].option;
				}
			}
			if (category === "themes" && ids.length) {
				let themeInput = document.querySelector(`#theme input[value="${ ids[0] }"]`);
				if (themeInput) {
					themeInput.checked = true;
					themeInput.dispatchEvent(new Event("change"));
				}
			}
			let makeDefault = id => {
				if (id !== "meta") {
					if (components[category][id]) {
						if (components[category][id].option !== "default") {
							components[category][id].option = "default";
						}

						toArray(components[category][id].require).forEach(makeDefault);
					}
				}
			};
			ids.forEach(makeDefault);
		}
	});
}

// Stay compatible with old querystring feature
let qstr = location.search.match(/(?:languages|plugins)=[-+\w]+|themes=[-\w]+/g);
if (qstr && !hstr) {
	location.hash = location.search.replace(/^\?/, "");
	location.search = "";
}

for (let category in components) {
	let all = components[category];

	all.meta.section = form.querySelector(`#category-${category}`);
	all.meta.section.querySelector(`[name="check-all-${category}"]`)?.addEventListener("change", ({ target }) => {
		all.meta.section.querySelectorAll(`input[name="download-${category}"]`).forEach(input => {
			all[input.value].enabled = input.checked = target.checked;
		});

		update(category);
	});

	for (let id in all) {
		if (id === "meta") {
			continue;
		}

		let input = all.meta.section.querySelector(`label[data-id="${id}"] > input`);

		let checked = false;
		let disabled = false;
		let option = all[id].option || all.meta.option;

		switch (option) {
			case "mandatory": disabled = true; // fallthrough
			case "default": checked = true;
		}

		if (category === "themes" && storedTheme) {
			checked = id === storedTheme;
		}

		input.checked = checked;
		input.disabled = disabled;

		let filepath = all.meta.path.replace(/\{id\}/g, id);

		let info = all[id] = {
			noCSS: all[id].noCSS || all.meta.noCSS,
			noJS: all[id].noJS || all.meta.noJS,
			enabled: checked,
			require: toArray(all[id].require),
			after: toArray(all[id].after),
			modify: toArray(all[id].modify),
			files: {
				minified: {
					paths: [],
					size: 0
				},
				dev: {
					paths: [],
					size: 0
				}
			}
		};

		info.require.forEach(v => {
			dependencies[v] = (dependencies[v] || []).concat(id);
		});

		if (!all[id].noJS && !/\.css$/.test(filepath)) {
			info.files.minified.paths.push(filepath.replace(/(\.js)?$/, ".min.js"));
			info.files.dev.paths.push(filepath.replace(/(\.js)?$/, ".js"));
		}


		if ((!all[id].noCSS && !/\.js$/.test(filepath)) || /\.css$/.test(filepath)) {
			let cssFile = filepath.replace(/(\.css)?$/, ".css");
			let minCSSFile = cssFile.replace(/(?:\.css)$/, ".min.css");

			info.files.minified.paths.push(minCSSFile);
			info.files.dev.paths.push(cssFile);
		}

		input.addEventListener("change", ({ target }) => {
			form.querySelectorAll(`input[name="${target.name}"]`).forEach(input => {
				all[input.value].enabled = input.checked;
			});

			if (all[id].require && target.checked) {
				all[id].require.forEach(v => {
					let input = form.querySelector(`label[data-id="${v}"] > input`);
					input.checked = true;
					input.dispatchEvent(new Event("change"));
				});
			}

			if (dependencies[id] && !target.checked) { // It’s required by others
				dependencies[id].forEach(dependent => {
					let input = form.querySelector(`label[data-id="${dependent}"] > input`);
					input.checked = false;
					input.dispatchEvent(new Event("change"));
				});
			}

			update(category, id);
		});

		// Handle change events on main theme selector too.
		if (category === "themes") {
			let themeInput = document.querySelector(`#theme input[value="${id}"]`);
			themeInput?.addEventListener("change", () => {
				if (!input.checked) {
					input.checked = true;
					input.dispatchEvent(new Event("change"));
				}
			});
		}
	}
}

form.elements.compression[0].onclick =
	form.elements.compression[1].onclick = function () {
		minified = !!+this.value;

		getFilesSizes();
	};

getFilesSizes();

function getFileSize(filepath) {
	for (let i = 0, l = tree.length; i < l; i++) {
		if (tree[i].path === filepath) {
			return tree[i].size;
		}
	}
}

function getFilesSizes() {
	for (let category in components) {
		let all = components[category];

		for (let id in all) {
			if (id === "meta") {
				continue;
			}

			let distro = all[id].files[minified ? "minified" : "dev"];
			let files = distro.paths;

			files.forEach(filepath => {
				let file = cache[filepath] = cache[filepath] || {};

				if (!file.size) {
					let size = getFileSize(filepath);
					if (size) {
						file.size = size;
						distro.size += file.size;

						update(category, id);
					}
				}
				else {
					update(category, id);
				}
			});
		}
	}
}

function prettySize(size) {
	return Math.round(100 * size / 1024) / 100 + "KB";
}

function update(updatedCategory, updatedId) {
	// Update total size
	let total = { js: 0, css: 0 }; let updated = { js: 0, css: 0 };

	for (let category in components) {
		let all = components[category];
		let allChecked = true;

		for (let id in all) {
			let info = all[id];

			if (info.enabled || id === updatedId) {
				let distro = info.files[minified ? "minified" : "dev"];

				distro.paths.forEach(path => {
					if (cache[path]) {
						let file = cache[path];

						let type = path.match(/\.(\w+)$/)[1];
						let size = file.size || 0;

						if (info.enabled) {

							if (!file.contentsPromise) {
								file.contentsPromise = getFileContents("https://dev.prismjs.com/" + path);
							}

							total[type] += size;
						}

						if (id == updatedId) {
							updated[type] += size;
						}
					}
				});
			}
			if (id !== "meta" && !info.enabled) {
				allChecked = false;
			}

			// Select main theme
			if (category === "themes" && id === updatedId && info.enabled) {
				let themeInput = document.querySelector(`#theme input[value="${updatedId}"]`);
				if (themeInput) {
					themeInput.checked = true;
					themeInput.dispatchEvent(new Event("change"));
				}
			}
		}

		if (all.meta.addCheckAll) {
			form.querySelector(`input[name="check-all-${category}"]`).checked = allChecked;
		}
	}

	total.all = total.js + total.css;

	if (updatedId) {
		updated.all = updated.js + updated.css;

		Object.assign(form.querySelector(`label[data-id="${updatedId}"] .filesize`), {
			textContent: prettySize(updated.all),
			title: (updated.js ? Math.round(100 * updated.js / updated.all) + "% JavaScript" : "") +
				(updated.js && updated.css ? " + " : "") +
				(updated.css ? Math.round(100 * updated.css / updated.all) + "% CSS" : "")
		});
	}

	form.querySelector("#filesize").textContent = prettySize(total.all);

	Object.assign(form.querySelector("#percent-js"), {
		textContent: Math.round(100 * total.js / total.all) + "%",
		title: prettySize(total.js)
	});

	Object.assign(form.querySelector("#percent-css"), {
		textContent: Math.round(100 * total.css / total.all) + "%",
		title: prettySize(total.css)
	});

	delayedGenerateCode();
}

// "debounce" multiple rapid requests to generate and highlight code
function delayedGenerateCode() {
	if (timerId !== 0) {
		clearTimeout(timerId);
	}
	timerId = setTimeout(generateCode, 500);
}

async function generateCode() {
	/** @type {CodePromiseInfo[]} */
	let promises = [];
	let redownload = {};

	for (let category in components) {
		for (let id in components[category]) {
			if (id === "meta") {
				continue;
			}

			let info = components[category][id];
			if (info.enabled) {
				if (category !== "core") {
					redownload[category] = redownload[category] || [];
					redownload[category].push(id);
				}
				info.files[minified ? "minified" : "dev"].paths.forEach(path => {
					if (cache[path]) {
						let type = path.match(/\.(\w+)$/)[1];

						promises.push({
							contentsPromise: cache[path].contentsPromise,
							id: id,
							category: category,
							path: path,
							type: type
						});
					}
				});
			}
		}
	}

	// Hide error message if visible
	let error = form.querySelector("#download .error");
	error.style.display = "";

	let res = await buildCode(promises);
	let version = await getVersion();

	let code = res.code;
	let errors = res.errors;

	if (errors.length) {
		error.style.display = "block";
		error.innerHTML = "";
		error.append(...errors);
	}

	let redownloadUrl = location.href.split("#")[0] + "#";
	for (let category in redownload) {
		redownloadUrl += category + "=" + redownload[category].join("+") + "&";
	}
	redownloadUrl = redownloadUrl.replace(/&$/, "");
	location.replace(redownloadUrl);

	let versionComment = "/* PrismJS " + version + "\n" + redownloadUrl + " */";

	for (let type in code) {
		let text = versionComment + "\n" + code[type];
		let fileName = "prism." + type;

		let codeElement = form.querySelector(`#download-${type} code`);

		let newCode = Object.assign(document.createElement("code"), {
			className: codeElement.className,
			textContent: text
		});

		Prism.highlightElement(newCode, false, () => {
			codeElement.replaceWith(newCode);
		});

		form.querySelector(`#download-${type} .download-button`).onclick = () => {
			saveAs(new Blob([text], { type: "application/octet-stream;charset=utf-8" }), fileName);
		};
	}
}

/**
 * Returns a promise of the code of the Prism bundle.
 *
 * @param {CodePromiseInfo[]} promises
 * @returns {Promise<{ code: { js: string, css: string }, errors: HTMLElement[] }>}
 *
 * @typedef CodePromiseInfo
 * @property {Promise} contentsPromise
 * @property {string} id
 * @property {string} category
 * @property {string} path
 * @property {string} type
 */
function buildCode(promises) {
	// sort the promises

	/** @type {CodePromiseInfo[]} */
	let finalPromises = [];
	/** @type {Object<string, CodePromiseInfo[]>} */
	let toSortMap = {};

	promises.forEach(p => {
		if (p.category === "core" || p.category === "themes") {
			finalPromises.push(p);
		} else {
			let infos = toSortMap[p.id];
			if (!infos) {
				toSortMap[p.id] = infos = [];
			}
			infos.push(p);
		}
	});

	// this assumes that the ids in `toSortMap` are complete under transitive requirements
	getLoader(components, Object.keys(toSortMap)).getIds().forEach(id => {
		if (!toSortMap[id]) {
			console.error(`${ id } not found.`);
		}
		finalPromises.push.apply(finalPromises, toSortMap[id]);
	});
	promises = finalPromises;

	// build
	let i = 0;
	let l = promises.length;
	let code = { js: "", css: "" };
	let errors = [];

	let f = function (resolve) {
		if (i < l) {
			let p = promises[i];
			p.contentsPromise.then(function (contents) {
				code[p.type] += contents + (p.type === "js" && !/;\s*$/.test(contents) ? ";" : "") + "\n";
				i++;
				f(resolve);
			});
			p.contentsPromise["catch"](function () {
				errors.push(Object.assign(document.createElement("p"), {
					textContent: `An error occurred while fetching the file "${ p.path }".`
				}));
				i++;
				f(resolve);
			});
		} else {
			resolve({ code: code, errors: errors });
		}
	};

	return new Promise(f);
}

/**
 * @returns {Promise<string>}
 */
async function getVersion() {
	let packageJSON = await getFileContents("https://dev.prismjs.com/package.json");
	return JSON.parse(packageJSON).version;
}
