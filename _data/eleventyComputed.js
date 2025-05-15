export default {
	components (data) {
		return { ...data.components };
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
	// Plugin id
	id (data) {
		let parts = data.page.inputPath.slice(2).split("/");
		if (parts[0] === "plugins") {
			// Folder name ↔ plugin id
			return parts[1];
		}
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
	resources (data) {
		let { id, resources = [] } = data;
		let ret = [];

		resources = Array.isArray(resources) ? resources : [resources];
		ret.push(...resources);

		if (!id) {
			return ret;
		}

		// We are working with plugin resources
		ret.push(`./prism-${id}.js`);

		if (!data.noCSS) {
			ret.push(`./prism-${id}.css`);
		}

		return ret;
	},
};
