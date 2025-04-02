export default {
	components (data) {
		let components = { ...data.components };
		components.plugins = { ...(data.pluginsWithMeta ?? {}) };
		return components;
	},
	plugins (data) {
		let plugins = { ...data.pluginsWithMeta };
		delete plugins.meta;
		return plugins;
	},
	themes (data) {
		let themes = { ...data.components.themes };
		delete themes.meta;
		return themes;
	},
	languages (data) {
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
	files_sizes (data) {
		let ret = {};
		for (let file of data.tree) {
			ret[file.path] = file.size;
		}
		return ret;
	},
};
