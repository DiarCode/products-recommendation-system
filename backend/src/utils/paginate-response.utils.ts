import { PaginateQuery, Paginated } from 'nestjs-paginate'
import { SortBy } from 'nestjs-paginate/lib/helper'
import { getPaginationMeta } from './pagination.util'

export async function paginateResponse<T>(
	query: PaginateQuery,
	data: T[],
	totalItems: number,
): Promise<Paginated<T>> {
	const paginationMeta = getPaginationMeta(query)

	return {
		data,
		meta: {
			...paginationMeta,
			totalItems,
			totalPages: Math.ceil(totalItems / paginationMeta.itemsPerPage),
			sortBy: (query.sortBy || []) as SortBy<T>,
			search: query.search || '',
			searchBy: [],
			select: [],
			filter: query.filter,
		},
		links: {
			first: `?page=1&limit=${paginationMeta.itemsPerPage}`,
			previous:
				paginationMeta.currentPage > 1
					? `?page=${paginationMeta.currentPage - 1}&limit=${paginationMeta.itemsPerPage}`
					: null,
			current: `?page=${paginationMeta.currentPage}&limit=${paginationMeta.itemsPerPage}`,
			next:
				paginationMeta.currentPage < Math.ceil(totalItems / paginationMeta.itemsPerPage)
					? `?page=${paginationMeta.currentPage + 1}&limit=${paginationMeta.itemsPerPage}`
					: null,
			last: `?page=${Math.ceil(totalItems / paginationMeta.itemsPerPage)}&limit=${paginationMeta.itemsPerPage}`,
		},
	}
}
