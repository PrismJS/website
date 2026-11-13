/**
 * The one Prism instance the site runs on.
 */
import Prism from "/index.js";
// Pages use <pre data-src> without loading the plugin themselves
import "/plugins/file-highlight.js";

// The global Prism's own bundled demos expect. global.js hands them this instance.
globalThis.Prism = Prism;

export default Prism;
