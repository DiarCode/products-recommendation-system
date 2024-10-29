import Image from 'next/image'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/core/components/ui/carousel'
import { getLandingImageUrl } from '@/core/lib/images.utils'
import { adminStoreConfigsService } from '@/modules/admin/store-config/services/store-config.service'
import { QueryProductsList } from '@/modules/products/components/query-products-list'
import { PRODUCTS_QUERY_KEY } from '@/modules/products/hooks/use-products'
import { productsService } from '@/modules/products/services/products.service'

export const metadata: Metadata = {
	title: 'Главная'
}

export default async function HomePage() {
	const queryClient = getQueryClient()

	await queryClient.prefetchQuery({
		queryKey: [PRODUCTS_QUERY_KEY],
		queryFn: () => productsService.getPageableProducts()
	})

	const storeConfig = await adminStoreConfigsService.getStoreConfig()

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<Carousel className='relative w-full'>
				<CarouselContent>
					{storeConfig?.landingImages.map(image => (
						<CarouselItem key={image}>
							<div className='relative aspect-[3/1] max-h-[466px] w-full bg-muted/60'>
								<Image
									src={getLandingImageUrl(image)}
									alt='Banner'
									className='rounded-2xl object-cover object-center'
									loading='eager'
									fill
									priority
								/>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious
					className='absolute left-6 top-1/2'
					variant='outline'
				/>
				<CarouselNext
					className='absolute right-6 top-1/2'
					variant='outline'
				/>
			</Carousel>

			<QueryProductsList className='mt-8' />
		</HydrationBoundary>
	)
}
