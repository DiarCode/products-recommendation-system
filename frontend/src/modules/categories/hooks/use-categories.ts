import { useSuspenseQuery } from '@tanstack/react-query'

import { GetCategoriesFilter } from '../models/categories.types'
import { categoriesService } from '../services/categories.service'

export const CATEGORIES_QUERY_KEY = 'categories:all'

export const useCategories = (filter?: GetCategoriesFilter) => {
	return useSuspenseQuery({
		queryKey: [CATEGORIES_QUERY_KEY, filter],
		queryFn: () => categoriesService.getCategories(filter)
	})
}
