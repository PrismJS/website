import fs from "fs";
import path from "path";

// Ids of the languages with an example file, like "css" for examples/css.html
export default fs
	.readdirSync(new URL("../examples", import.meta.url))
	.map(file => path.parse(file).name);
