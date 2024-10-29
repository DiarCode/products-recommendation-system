interface PaginationQuery {
	limit?: number
	page?: number
}

interface PaginationMeta {
	itemsPerPage: number
	currentPage: number
	skip: number
	take: number
}

export const DEFAULT_LIMIT = 10
export const DEFAULT_PAGE = 1

export function getPaginationMeta(query: PaginationQuery): PaginationMeta {
	const limit = query.limit ?? DEFAULT_LIMIT
	const page = query.page ?? DEFAULT_PAGE
	const skip = (page - 1) * limit
	return { skip, take: limit, currentPage: page, itemsPerPage: limit }
}
