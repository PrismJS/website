export default {
	allPlugins (data) {
		let plugins = { ...data.components.plugins };
		delete plugins.meta;
		return plugins;
	},
	allThemes (data) {
		let themes = { ...data.components.themes };
		delete themes.meta;
		return themes;
	},
	allLanguages (data) {
		let languages = { ...data.components.languages };
		delete languages.meta;

		for (let id in languages) {
			let ret = [id];
			let alias = languages[id].alias;
			if (alias) {
				ret = ret.concat(Array.isArray(alias) ? alias : [alias]);
			}
			languages[id].alias = ret;
		}

		return languages;
	},
	title (data) {
		if (data.title) {
			return data.title;
		}

		let path = data.page.inputPath;
		path = path.slice(2);

		let title = path.replace(".md", "");
		if (title === "README") {
			return;
		}

		title = title.replace(/-/g, " ");

		return title[0].toUpperCase() + title.slice(1);
	},
};
