export interface PaginateQuery {
	page?: number
	limit?: number
	sortBy?: string
	searchBy?: string[]
	search?: string
	filter?: {
		[column: string]: string | string[] | undefined
	}
	select?: string[]
	path?: string
}

export interface Paginated<T> {
	data: T[]
	meta: {
		itemsPerPage: number
		totalItems: number
		currentPage: number
		totalPages: number
		sortBy: string
		search: string
		select: string[]
		filter?: {
			[column: string]: string | string[]
		}
	}
	links: {
		first?: string
		previous?: string
		current: string
		next?: string
		last?: string
	}
}
