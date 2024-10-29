type SortOrder = 'asc' | 'desc'

export function getSortingOptions<T>(
	sortBy: [string, string][] = [],
	defaultSort?: Partial<Record<keyof T, SortOrder>>,
): Partial<Record<keyof T, SortOrder>> {
	if (!sortBy.length) {
		return defaultSort
	}

	return sortBy.reduce<Partial<Record<keyof T, SortOrder>>>((acc, [field, order]) => {
		acc[field] = order.toLowerCase()
		return acc
	}, {})
}
