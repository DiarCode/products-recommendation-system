'use client'

import Image from 'next/image'

import { Suspense, useState } from 'react'

import { Products } from '../../models/products.types'

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious
} from '@/core/components/ui/carousel'
import { Skeleton } from '@/core/components/ui/skeleton'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { cn } from '@/core/lib/tailwind.utils'

interface ProductsDetailsImagesProps {
	product: Products
}

export const ProductsDetailsImages = ({
	product
}: ProductsDetailsImagesProps) => {
	const [currentImage, setCurrentImage] = useState(product.images[0])

	return (
		<Suspense
			fallback={
				<Skeleton className='h-[500px] w-full rounded-lg md:h-[700px]' />
			}
		>
			<div className='flex items-center gap-4 md:flex-row'>
				<div className='order-2 md:order-1 md:flex-1'>
					<Carousel orientation='vertical'>
						<CarouselContent className='max-h-[400px] md:max-h-[500px]'>
							{product.images.map((image, index) => (
								<CarouselItem key={image}>
									<button
										className={cn(
											'relative h-20 w-14 overflow-hidden rounded-md bg-muted md:h-28 md:w-20',
											image === currentImage && 'border border-primary'
										)}
										onClick={() => setCurrentImage(image)}
										aria-label={`Select image ${index + 1}`}
									>
										<Image
											src={getProductImageUrl(image)}
											alt={`Image ${index + 1}`}
											fill
											loading='lazy'
											className='h-full w-full object-contain'
											sizes='(max-width: 640px) 3.5rem, (min-width: 641px) 5rem'
										/>
									</button>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious variant='ghost' />
						<CarouselNext variant='ghost' />
					</Carousel>
				</div>

				<div className='relative order-1 h-[500px] w-full overflow-hidden rounded-xl bg-muted md:order-2 md:h-[700px]'>
					<Image
						src={getProductImageUrl(currentImage)}
						alt='Главный'
						priority
						fill
						className='h-full w-full object-contain'
						sizes='(max-width: 640px) 100vw, (min-width: 641px) 50vw'
					/>
				</div>
			</div>
		</Suspense>
	)
}
