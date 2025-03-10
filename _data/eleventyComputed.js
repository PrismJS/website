export default {
	allPlugins (data) {
		let plugins = data.components.plugins;
		delete plugins.meta;
		return plugins;
	},
	allThemes (data) {
		let themes = data.components.themes;
		delete themes.meta;
		return themes;
	},
	allLanguages (data) {
		let languages = data.components.languages;
		delete languages.meta;

		for (let id in languages) {
			let alias = languages[id].alias;
			if (typeof alias === "string") {
				languages[id].alias = [alias];
			}

			(languages[id].alias ??= []).unshift(id);
		}

		return languages;
	},
};
