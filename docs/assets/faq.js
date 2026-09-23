/**
 * Show tokens for a language on the FAQ page
 */

import { toArray } from "./util.js";

let languageSelect = document.querySelector("#language-select");
languageSelect.addEventListener("change", showTokens);

let tokensOutput = document.querySelector("#print-tokens-output");

function printTokens (grammar) {
	let lines = [];
	function log (line) {
		if (!lines.includes(line)) {
			lines.push(line);
		}
	}

	let languageMap = new Map();
	let languages = [...languageSelect.options].map(o => o.value);
	Prism.components.entries
		.keys()
		.filter(l => languages.includes(l))
		.forEach(l => languageMap.set(Prism.components.getLanguage(l), `Prism.languages["${l}"]`));

	let stack = new Map();

	function inner (g, prefix) {
		if (prefix && languageMap.has(g)) {
			log(prefix + " > ..." + languageMap.get(g));
			return;
		}
		if (stack.has(g)) {
			log(prefix + " > ..." + stack.get(g));
			return;
		}

		stack.set(g, "(" + (prefix || ":root:") + ")");

		for (let name in g) {
			let element = g[name];
			if (name === "rest") {
				inner(element, (prefix ? prefix + " > " : "") + ":rest:");
			}
			else {
				for (let a = toArray(element), i = 0, token; (token = a[i++]); ) {
					let line =
						(prefix ? prefix + " > " : "") +
						name +
						toArray(token.alias)
							.map(a => "." + a)
							.join("");

					log(line);

					if (token.inside) {
						inner(token.inside, line);
					}
				}
			}
		}

		stack.delete(g);
	}
	inner(grammar, "");

	return lines.join("\n");
}

let loadedLanguages = {};
function showTokens () {
	let language = languageSelect.value;
	if (Prism.components.has(language)) {
		tokensOutput.textContent = printTokens(Prism.components.getLanguage(language));
	}
	else if (language in loadedLanguages) {
		tokensOutput.textContent = `"${language}" doesn't have any tokens.`;
	}
	else {
		// load grammar
		Prism.plugins.autoloader
			.loadLanguages(language)
			.then(() => {
				loadedLanguages[language] = true;
				showTokens();
			})
			.catch(() => {
				tokensOutput.textContent = `Unable to load "${language}"`;
			});
	}
}

// Give Prism a chance to load
setTimeout(showTokens, 100);
