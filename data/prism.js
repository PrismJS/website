import components from "../docs/components.json" with { type: "json" };
import file_sizes from "../docs/file-sizes.json" with { type: "json" };

// Every category keeps a `meta` entry among its components
let { meta, ...languages } = components.languages;

export default { components, file_sizes, languages };
