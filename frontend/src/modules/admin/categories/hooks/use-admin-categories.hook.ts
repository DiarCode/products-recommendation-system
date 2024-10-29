import { useSuspenseQuery } from '@tanstack/react-query'

import { PaginateQuery } from '@/core/models/paginate.types'
import { categoriesService } from '@/modules/categories/services/categories.service'

export const ADMIN_CATEGORIES_QUERY_KEY = 'admin-categories:all'

export const useAdminCategories = (query?: PaginateQuery) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_CATEGORIES_QUERY_KEY, query],
		queryFn: () => categoriesService.getCategoriesPageable(query)
	})
}

export const ADMIN_CATEGORY_DETAILS_QUERY_KEY = 'admin-categories:details'

export const useAdminCategory = (id: string) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_CATEGORY_DETAILS_QUERY_KEY, id],
		queryFn: () => categoriesService.getCategoryById(id)
	})
}
