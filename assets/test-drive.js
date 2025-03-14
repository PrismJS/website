/** @type {HTMLFormElement} */
let form = document.querySelector("form");

/** @type {HTMLElement} */
let code = form.querySelector("code");

/** @type {HTMLElement} */
let pre = form.querySelector("pre");

/** @type {HTMLAnchorElement} */
let shareLink = form.querySelector("#share-link");

/** @type {HTMLInputElement} */
let shareLinkInput = form.querySelector("#share-link-input");

/** @type {HTMLButtonElement} */
let copyShareLink = form.querySelector("#copy-share-link");

/** @type {HTMLTextAreaElement} */
let textarea = form.querySelector("textarea");

/** @type {HTMLInputElement} */
let showTokens = form.querySelector("#option-show-tokens");

/** @type {HTMLInputElement[]} */
let radios = Array.from(form.querySelectorAll("input[name=language]"));

/** @type {HTMLInputElement} */
let selectedRadio = radios[0];

/** @type {HTMLInputElement} */
let lastLanguageRadio = getRadio(getHashLanguage());

document.addEventListener("hashchange", () => {
	let input = getRadio(getHashLanguage());

	if (input && !input.checked) {
		input.click();
	}
});

radios.forEach(radio => {
	radio.addEventListener("change", ({ target }) => {
		let lang = target.value;
		code.className = "language-" + lang;
		code.textContent = code.textContent;
		updateHashLanguage(lang);
		updateShareLink();

		highlightCode();
	});
});

textarea.addEventListener("input", ({ target }) => {
	let codeText = target.value || "";
	code.textContent = codeText;
	highlightCode();
	updateShareLink();

	try {
		sessionStorage.setItem("test-code", codeText);
	}
	catch (error) {
		// ignore sessionStorage errors
	}
});

showTokens.addEventListener("change", () =>
	pre.classList[showTokens.checked ? "add" : "remove"]("show-tokens"));

copyShareLink.addEventListener("click", copyShare);
shareLinkInput.addEventListener("click", ({ target }) => target.select());

if (lastLanguageRadio) {
	selectedRadio = lastLanguageRadio;
}

try {
	let hashText = getHashParams().text;
	if (hashText) {
		textarea.value = hashText;
	}
	else {
		let lastCode = sessionStorage.getItem("test-code");
		if (lastCode) {
			textarea.value = lastCode;
		}
	}
}
catch (e) {
	// ignore sessionStorage errors
}

selectedRadio.click();
textarea.dispatchEvent(new Event("input"));

function highlightCode () {
	let newCode = Object.assign(document.createElement("code"), {
		textContent: code.textContent,
		className: code.className,
	});

	Prism.highlightElement(newCode);

	code.replaceWith(newCode);
	code = newCode;
}

function getHashParams () {
	return parseUrlParams((location.hash || "").slice(1));
}

function setHashParams (params) {
	location.hash = stringifyUrlParams(params);
}

function updateHashLanguage (lang) {
	let params = getHashParams();
	params.language = lang;
	setHashParams(params);
}

function getHashLanguage () {
	return getHashParams().language;
}

function getRadio (lang) {
	return radios.find(radio => radio.value === lang);
}

function copyShare () {
	let link = shareLink.href;

	try {
		navigator.clipboard.writeText(link).then(
			() => (copyShareLink.textContent = "Copied!"),
			() => (copyShareLink.textContent = "Failed to copy!"),
		);
	}
	catch (e) {
		copyShareLink.textContent = "Failed to copy!";
	}
	setTimeout(() => (copyShareLink.textContent = "Copy to clipboard"), 5000);
}

function updateShareLink () {
	let params = {
		language: /\blang(?:uage)?-([\w-]+)\b/i.exec(code.className)[1],
		text: code.textContent,
	};

	shareLink.href = "#" + stringifyUrlParams(params);
	shareLinkInput.value = shareLink.href;
}

/**
 * @param {Record<string, string | number | boolean>} params
 * @returns {string}
 */
function stringifyUrlParams (params) {
	let parts = [];
	for (let name in params) {
		if (params.hasOwnProperty(name)) {
			let value = params[name];
			if (typeof value === "boolean") {
				if (value) {
					parts.push(name);
				}
			}
			else {
				parts.push(name + "=" + encodeURIComponent(value));
			}
		}
	}
	return parts.join("&");
}

/**
 * @param {string} str
 * @returns {Record<string, string | boolean>}
 */
function parseUrlParams (str) {
	/** @type {Record<string, string | boolean>} */
	let params = {};
	str.split(/&/g)
		.filter(Boolean)
		.forEach(part => {
			let parts = part.split(/=/);
			let name = parts[0];
			if (parts.length === 1) {
				params[name] = true;
			}
			else {
				params[name] = decodeURIComponent(parts[1]);
			}
		});
	return params;
}
