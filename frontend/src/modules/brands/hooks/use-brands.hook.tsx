import { useSuspenseQuery } from '@tanstack/react-query'

import { GetBrandsFilter } from '../models/brands.types'
import { brandService } from '../services/brands.service'

export const BRANDS_QUERY_KEY = 'brands:all'

export const useBrands = (filter?: GetBrandsFilter) => {
	return useSuspenseQuery({
		queryKey: [BRANDS_QUERY_KEY, filter],
		queryFn: () => brandService.getAll(filter)
	})
}
