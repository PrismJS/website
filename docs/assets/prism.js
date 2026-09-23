/**
 * The one Prism instance the site runs on.
 */
import Prism from "/index.js";
// Pages use <pre data-src> without loading the plugin themselves
import "/plugins/file-highlight.js";

// Core waits for the document only when loaded by a deferred classic <script>, and this is a module.
// Without this, it highlights before the plugins the page loads next register, like keep-markup.
// Those are module scripts too, and they all run before DOMContentLoaded.
Prism.waitFor.push(
	new Promise(resolve => document.addEventListener("DOMContentLoaded", resolve, { once: true })),
);

// The global Prism's own bundled demos expect. global.js hands them this instance.
globalThis.Prism = Prism;

export default Prism;
