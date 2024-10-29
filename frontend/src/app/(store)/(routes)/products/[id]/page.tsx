import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { ProductsDetailsAdd } from '@/modules/products/components/products-details/products-details-add'
import { ProductsDetailsHeader } from '@/modules/products/components/products-details/products-details-header'
import { ProductsDetailsImages } from '@/modules/products/components/products-details/products-details-images'
import { ProductsDetailsInfo } from '@/modules/products/components/products-details/products-details-info'
import { RateProductCard } from '@/modules/products/components/products-details/products-details-rate'
import { ProductsRatingsList } from '@/modules/products/components/products-details/produt-details-ratings-list'
import { QueryProductsList } from '@/modules/products/components/query-products-list'
import {
	PRODUCTS_QUERY_KEY,
	PRODUCT_DETAILS_QUERY_KEY
} from '@/modules/products/hooks/use-products'
import { productsService } from '@/modules/products/services/products.service'

export async function generateMetadata({
	params
}: ProductDetailsPageProps): Promise<Metadata> {
	const id = params.id

	const product = await productsService.getProductById(id)

	return {
		title: product?.name ?? 'Детали товара'
	}
}

interface ProductDetailsPageProps {
	params: { id: string }
}

export default async function ProductDetailsPage({
	params: { id }
}: ProductDetailsPageProps) {
	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: [PRODUCTS_QUERY_KEY],
		queryFn: () => productsService.getPageableProducts()
	})

	const product = await productsService.getProductById(id)

	await queryClient.prefetchQuery({
		queryKey: [PRODUCT_DETAILS_QUERY_KEY, id],
		queryFn: () => productsService.getProductById(id),
		initialData: product
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{product ? (
				<div>
					<ProductsDetailsHeader
						product={product}
						className='mt-4'
					/>

					<div className='mt-8 grid grid-cols-12 md:gap-6 lg:gap-8'>
						<div className='col-span-full md:col-span-8 lg:col-span-5'>
							<ProductsDetailsImages product={product} />
						</div>

						<div className='col-span-full mt-8 md:col-span-4 md:mt-0 lg:col-span-4'>
							<ProductsDetailsInfo product={product} />
						</div>

						<div className='hidden lg:col-span-3 lg:block'>
							<div className='sticky top-20'>
								<ProductsDetailsAdd product={product} />
								<RateProductCard
									className='mt-4'
									productId={product.id}
								/>
							</div>
						</div>
					</div>

					<div className='mt-8 space-y-4'>
						<h4 className='text-lg font-bold'>Отзывы</h4>
						<ProductsRatingsList productId={product.id} />
					</div>

					<QueryProductsList
						className='mt-8'
						label='Смотрите похожие товары'
					/>
				</div>
			) : (
				<div className='mt-12 flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-2xl font-bold'>Товар не найден</h1>
						<h2 className='mt-4 text-center'>
							Пожалуйста, проверьте правильность пути или выберите другой товар
							из каталога.
						</h2>
					</div>
				</div>
			)}
		</HydrationBoundary>
	)
}
