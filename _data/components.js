import Fetch from "@11ty/eleventy-fetch";

export default async () => {
	let components = await Fetch("https://dev.prismjs.com/components.json", {
		duration: "1d",
		type: "json",
	});

	return { ...components };
};
