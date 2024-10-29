import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { AdminProductDetailsContainer } from '@/modules/admin/products/admin-product-details-container'
import { ProductsDetails } from '@/modules/admin/products/components/admin-products-details'
import { PRODUCT_DETAILS_QUERY_KEY } from '@/modules/products/hooks/use-products'
import { productsService } from '@/modules/products/services/products.service'

export async function generateMetadata({
	params
}: AdminProductsDetailsPageProps): Promise<Metadata> {
	const id = params.id

	const product = await productsService.getProductById(id)

	return {
		title: product?.name ?? 'Детали товара'
	}
}

interface AdminProductsDetailsPageProps {
	params: { id: string }
}

export default async function AdminProductsDetailsPage({
	params: { id }
}: AdminProductsDetailsPageProps) {
	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: [PRODUCT_DETAILS_QUERY_KEY, id],
		queryFn: () => productsService.getProductById(id)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminProductDetailsContainer productId={id} />
		</HydrationBoundary>
	)
}
