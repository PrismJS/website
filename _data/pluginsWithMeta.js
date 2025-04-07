import Fetch from "@11ty/eleventy-fetch";

export default async () => {
	try {
		let plugins = await Fetch("https://plugins.prismjs.com/plugins.json", {
			duration: "1d",
			type: "json",
		});

		return plugins;
	}
	catch (e) {
		console.error(e);
		return {};
	}
};
