let components = await (await fetch("https://dev.prismjs.com/components.json")).json();
let themes = components.themes;

let currentTheme = (location.search.match(/theme=([\w-]+)/) ?? [])[1];
if (!(currentTheme in themes)) {
	currentTheme = undefined;
}

if (currentTheme === undefined) {
	let stored = localStorage.getItem("theme");

	currentTheme = stored in themes ? stored : "prism";
}

let themeLink = document.querySelector(`link[href*="themes/prism"]`);
document.querySelectorAll("input[name=theme]").forEach(input => {
	if (input.value === currentTheme) {
		input.checked = true;
		themeLink.href =
			"https://dev.prismjs.com/" + themes.meta.path.replace(/\{id\}/g, input.value);
	}

	input.addEventListener("change", () => {
		let id = input.value;
		themeLink.href = "https://dev.prismjs.com/" + themes.meta.path.replace(/\{id\}/g, id);
		localStorage.setItem("theme", id);
	});
});
