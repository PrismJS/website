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
