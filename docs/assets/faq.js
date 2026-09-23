/**
 * Show tokens for a language on the FAQ page
 */

import Prism from "./prism.js";
import { toArray } from "./util.js";

let languageSelect = document.querySelector("#language-select");
languageSelect.addEventListener("change", showTokens);

let tokensOutput = document.querySelector("#print-tokens-output");

// Prism.languages holds language definitions; the tokens live in the grammar they resolve to
function grammar (id) {
	return Prism.languageRegistry.getLanguage(id).resolvedGrammar;
}

function printTokens (root) {
	let lines = [];
	function log (line) {
		if (!lines.includes(line)) {
			lines.push(line);
		}
	}

	let languageMap = new Map();
	let languages = [...languageSelect.options].map(o => o.value);
	Object.keys(Prism.languages)
		.filter(l => languages.includes(l))
		.forEach(l => languageMap.set(grammar(l), `Prism.languages["${l}"]`));

	let stack = new Map();

	function inner (g, prefix) {
		// v2 can name the grammar by language id, as in `inside: "xml"`
		if (typeof g === "string") {
			log(`${prefix} > ...Prism.languages["${g}"]`);
			return;
		}
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
			if (name === "$rest") {
				inner(element, (prefix ? prefix + " > " : "") + ":rest:");
			}
			// Other special keys, like `$inner`, aren't tokens
			else if (!name.startsWith("$")) {
				for (let a = toArray(element), i = 0, token; (token = a[i++]);) {
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
	inner(root, "");

	return lines.join("\n");
}

let loadedLanguages = {};
function showTokens () {
	let language = languageSelect.value;
	if (Prism.languageRegistry.has(language)) {
		tokensOutput.textContent = printTokens(grammar(language));
	}
	else if (language in loadedLanguages) {
		tokensOutput.textContent = `"${language}" doesn't have any tokens.`;
	}
	else {
		// load grammar
		Prism.loadLanguage(language)
			.then(() => {
				loadedLanguages[language] = true;
				showTokens();
			})
			.catch(() => {
				tokensOutput.textContent = `Unable to load "${language}"`;
			});
	}
}

showTokens();
