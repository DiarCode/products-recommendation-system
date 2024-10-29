import { useSuspenseQuery } from '@tanstack/react-query'

import { PaginateQuery } from '@/core/models/paginate.types'
import { brandCategoriesService } from '@/modules/brands/services/brand-category.service'

export const ADMIN_BRAND_CATEGORIES_QUERY_KEY = 'admin-brand-categories:all'

export const useAdminBrandCategories = (query?: PaginateQuery) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_BRAND_CATEGORIES_QUERY_KEY, query],
		queryFn: () => brandCategoriesService.getBrandCategoriesPageable(query)
	})
}
