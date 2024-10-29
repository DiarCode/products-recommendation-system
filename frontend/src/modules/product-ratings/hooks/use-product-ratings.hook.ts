import { useSuspenseQuery } from '@tanstack/react-query'

import { productRatingsService } from '../services/product-ratings.service'

export const PRODUCT_RATINGS_QUERY_KEY = 'product-ratings:all'

export const useProductRatings = (productId: string) => {
	return useSuspenseQuery({
		queryKey: [PRODUCT_RATINGS_QUERY_KEY, productId],
		queryFn: () => productRatingsService.getRatingsForProduct(productId)
	})
}
