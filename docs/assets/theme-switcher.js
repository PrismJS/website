// The form lists the themes and their stylesheet path, generated at build time
let form = document.forms.theme;
let radios = form.elements.theme;
let themes = [...radios].map(input => input.value);

let requested = new URLSearchParams(location.search).get("theme");
let stored = localStorage.getItem("theme");
let currentTheme = [requested, stored].find(id => themes.includes(id)) ?? "prism";

let themeLink = document.getElementById("prism-theme");
let setTheme = id => {
	themeLink.href = "/" + form.dataset.path.replaceAll("{id}", id);
};

radios.value = currentTheme;
setTheme(currentTheme);

form.addEventListener("change", () => {
	setTheme(radios.value);
	localStorage.setItem("theme", radios.value);
});
