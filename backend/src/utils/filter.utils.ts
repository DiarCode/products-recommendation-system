export function getFilterOptions<T>(
	filter?: Record<string, string | string[]>,
): Partial<Record<keyof T, unknown>> {
	const result: Partial<Record<keyof T, string>> = {}

	if (!filter) return result

	for (const [key, value] of Object.entries(filter)) {
		if (value) {
			result[key] = value
		}
	}

	return result
}
