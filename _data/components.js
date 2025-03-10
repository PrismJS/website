export default async () => {
	let components = await (await fetch("https://dev.prismjs.com/components.json")).json();

	return { ...components };
};
