/**
 * Convert a value to an array. `undefined` and `null` values are converted to an empty array.
 * @param {*} value - The value to convert.
 * @returns {any[]} The converted array.
 */
export function toArray (value) {
	if (value === undefined || value === null) {
		return [];
	}

	if (Array.isArray(value)) {
		return value;
	}

	// Don't convert "foo" into ["f", "o", "o"]
	if (typeof value !== "string" && typeof value[Symbol.iterator] === "function") {
		return Array.from(value);
	}

	return [value];
}

/**
 * Add a back to top link to the end of each element matching the given selector.
 * @param {string} selector - The selector to match elements.
 */
export function backToTop (selector = "section") {
	let elements = document.querySelectorAll(selector);
	elements.forEach(element => {
		element.insertAdjacentHTML("beforeend", `<p><a href="#toc">↑ Back to top</a></p>`);
	});
}
