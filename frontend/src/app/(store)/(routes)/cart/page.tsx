import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { CartView } from '@/modules/cart/components/cart-view'
import { QueryProductsList } from '@/modules/products/components/query-products-list'
import { PRODUCTS_QUERY_KEY } from '@/modules/products/hooks/use-products'
import { productsService } from '@/modules/products/services/products.service'

export const metadata: Metadata = {
	title: 'Корзина'
}

export default async function CartPage() {
	const queryClient = getQueryClient()

	queryClient.prefetchQuery({
		queryKey: [PRODUCTS_QUERY_KEY],
		queryFn: () => productsService.getPageableProducts()
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CartView />

			<QueryProductsList
				className='mt-12'
				label='Рекомендуем'
			/>
		</HydrationBoundary>
	)
}
