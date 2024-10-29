import { useSuspenseQuery } from '@tanstack/react-query'

import { PaginateQuery } from '@/core/models/paginate.types'
import { brandService } from '@/modules/brands/services/brands.service'

export const ADMIN_BRANDS_QUERY_KEY = 'admin-brands:all'

export const useAdminBrands = (query?: PaginateQuery) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_BRANDS_QUERY_KEY, query],
		queryFn: () => brandService.getPageable(query)
	})
}

export const ADMIN_BRAND_DETAILS_QUERY_KEY = 'admin-brands:details'

export const useAdminBrand = (id: string) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_BRAND_DETAILS_QUERY_KEY, id],
		queryFn: () => brandService.getById(id)
	})
}
