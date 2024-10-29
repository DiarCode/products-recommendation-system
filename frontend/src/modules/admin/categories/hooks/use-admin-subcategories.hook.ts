import { useSuspenseQuery } from '@tanstack/react-query'

import { PaginateQuery } from '@/core/models/paginate.types'
import { subCategoriesService } from '@/modules/categories/services/sub-category.service'

export const ADMIN_SUBCATEGORIES_QUERY_KEY = 'admin-subcategories:all'

export const useAdminSubCategories = (query?: PaginateQuery) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_SUBCATEGORIES_QUERY_KEY, query],
		queryFn: () => subCategoriesService.getSubCategoriesPageable(query)
	})
}
