import { cookies } from 'next/headers'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { MyRatingsList } from '@/modules/product-ratings/components/my-ratings-list'
import { MY_PRODUCT_RATINGS_QUERY_KEY } from '@/modules/product-ratings/hooks/use-my-ratings.hook'
import { productRatingsService } from '@/modules/product-ratings/services/product-ratings.service'

export const metadata: Metadata = {
	title: 'Мои отзывы'
}

export default async function ProfileReviewsPage() {
	const queryClient = getQueryClient()

	queryClient.prefetchQuery({
		queryKey: [MY_PRODUCT_RATINGS_QUERY_KEY],
		queryFn: () =>
			productRatingsService.getMyRatings({
				headers: { Cookie: cookies().toString() }
			})
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<MyRatingsList />
		</HydrationBoundary>
	)
}
