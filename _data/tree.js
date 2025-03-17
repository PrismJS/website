import Fetch from "@11ty/eleventy-fetch";

export default async () => {
	let repo = await Fetch(
		"https://api.github.com/repos/PrismJS/prism/git/trees/master?recursive=1",
		{
			duration: "1d",
			type: "json",
		},
	);

	return repo.tree;
};
