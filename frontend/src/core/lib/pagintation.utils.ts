import { PaginateQuery } from '../models/paginate.types'

export const DEFAULT_LIMIT = 10

export const getPaginationMeta = (query?: PaginateQuery): URLSearchParams => {
	const params = new URLSearchParams()

	if (!query) return params

	if (query.page)
		params.append('page', query.page ? query.page.toString() : '1')
	if (query.limit)
		params.append(
			'limit',
			query.limit ? query.limit.toString() : DEFAULT_LIMIT.toString()
		)
	if (query.sortBy) {
		params.append('sortBy', query.sortBy.toString())
	}
	if (query.search) params.append('search', query.search)
	if (query.filter) {
		for (const [key, value] of Object.entries(query.filter)) {
			if (Array.isArray(value)) {
				value.forEach(val => params.append(`filter.${key}`, val))
			} else {
				if (value) {
					params.append(`filter.${key}`, value)
				}
			}
		}
	}

	return params
}

export const getUrlSearchParams = (params?: unknown): URLSearchParams => {
	const searchParams = new URLSearchParams()

	if (!params) return searchParams

	for (const [key, value] of Object.entries(params)) {
		if (value !== null && value !== undefined) {
			searchParams.append(key, String(value))
		}
	}

	return searchParams
}
