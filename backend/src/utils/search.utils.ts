interface SearchCondition {
	contains: string
	mode: 'insensitive'
}

interface SearchOptions {
	OR?: Array<{
		name?: SearchCondition
		articul?: SearchCondition
		barcode?: SearchCondition
	}>
}

export function getSearchOptions(search: string): SearchOptions {
	const searchTrimmed = search?.trim()

	if (!searchTrimmed) {
		return {}
	}

	return {
		OR: [
			{ name: { contains: searchTrimmed, mode: 'insensitive' } },
			{ articul: { contains: searchTrimmed, mode: 'insensitive' } },
			{ barcode: { contains: searchTrimmed, mode: 'insensitive' } },
		],
	}
}
