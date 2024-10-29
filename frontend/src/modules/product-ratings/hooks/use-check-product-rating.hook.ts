import { useSuspenseQuery } from '@tanstack/react-query'

import { productRatingsService } from '../services/product-ratings.service'

export const CHECK_PRODUCT_RATINGS_QUERY_KEY = 'product-ratings:check'

export const useCheckProductRating = (productId: string) => {
	return useSuspenseQuery({
		queryKey: [CHECK_PRODUCT_RATINGS_QUERY_KEY, productId],
		queryFn: () => productRatingsService.checkIfUserCanRate(productId)
	})
}
