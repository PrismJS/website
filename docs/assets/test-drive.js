import Prism from "./prism.js";

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

/** @type {RadioNodeList} */
let radios = form.elements.language;

/** @type {Storage | undefined} */
let storage;
try {
	storage = sessionStorage;
}
catch {
	// sessionStorage is blocked, e.g. with cookies disabled
}

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
		updateHashLanguage(lang);
		updateShareLink();

		highlightCode();
	});
});

textarea.addEventListener("input", ({ target }) => {
	let codeText = target.value;
	code.textContent = codeText;
	highlightCode();
	updateShareLink();
	storage?.setItem("test-code", codeText);
});

showTokens.addEventListener("change", () =>
	pre.classList.toggle("show-tokens", showTokens.checked));

copyShareLink.addEventListener("click", copyShare);
shareLinkInput.addEventListener("click", ({ target }) => target.select());

textarea.value = getHashParams().get("text") || storage?.getItem("test-code") || textarea.value;

let initialRadio = getRadio(getHashLanguage()) ?? radios[0];
initialRadio.click();
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
	return new URLSearchParams(location.hash.slice(1));
}

function updateHashLanguage (lang) {
	let params = getHashParams();
	params.set("language", lang);
	location.hash = params;
}

function getHashLanguage () {
	return getHashParams().get("language");
}

function getRadio (lang) {
	return [...radios].find(radio => radio.value === lang);
}

async function copyShare () {
	try {
		await navigator.clipboard.writeText(shareLink.href);
		copyShareLink.textContent = "Copied!";
	}
	catch {
		copyShareLink.textContent = "Failed to copy!";
	}
	setTimeout(() => (copyShareLink.textContent = "Copy to clipboard"), 5000);
}

function updateShareLink () {
	let params = new URLSearchParams({
		language: radios.value,
		text: code.textContent,
	});

	shareLink.href = "#" + params;
	shareLinkInput.value = shareLink.href;
}
