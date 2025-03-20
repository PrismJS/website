import Fetch from "@11ty/eleventy-fetch";

export default async () => {
	let repo = await Fetch(
		// TODO: Replace with "https://api.github.com/repos/PrismJS/prism/git/trees/main?recursive=1" when v2 is launched
		"https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1",
		{
			duration: "1d",
			type: "json",
		},
	);

	return repo.tree;
};
