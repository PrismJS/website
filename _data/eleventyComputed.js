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
	// Plugin ID
	id (data) {
		let parts = data.page.inputPath.slice(2).split("/");
		if (parts[0] === "plugins") {
			// Folder name ↔ plugin id
			return parts[1];
		}
	},
	resources (data) {
		let { id, resources = [], plugins_url } = data;
		let ret = [];

		resources = Array.isArray(resources) ? resources : [resources];
		ret.push(...resources);

		if (!id) {
			return ret;
		}

		// We are working with a plugin's resources.
		// Convert relative URLs pointing to another plugin to absolute URLs
		for (let [index, resource] of ret.entries()) {
			if (resource.startsWith("../")) {
				resource = resource.slice(2); // remove "../"
				resource = `${plugins_url}${resource}`;
				ret[index] = resource;
			}
		}

		ret.push(`${plugins_url}/${id}/prism-${id}.js { type="module" }`);

		if (!data.noCSS) {
			ret.push(`${plugins_url}/${id}/prism-${id}.css`);
		}

		return ret;
	},
};
