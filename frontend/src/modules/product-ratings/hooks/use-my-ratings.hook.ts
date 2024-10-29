import { useSuspenseQuery } from '@tanstack/react-query'

import { productRatingsService } from '../services/product-ratings.service'

export const MY_PRODUCT_RATINGS_QUERY_KEY = 'my-product-ratings:all'

export const useMyProductRatings = () => {
	return useSuspenseQuery({
		queryKey: [MY_PRODUCT_RATINGS_QUERY_KEY],
		queryFn: () => productRatingsService.getMyRatings()
	})
}
