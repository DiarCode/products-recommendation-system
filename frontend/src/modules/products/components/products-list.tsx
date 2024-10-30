'use client'

import Image from 'next/image'
import Link from 'next/link'

import { useMutation } from '@tanstack/react-query'
import { Heart, ShoppingBasket } from 'lucide-react'
import { MouseEvent, memo, useCallback } from 'react'
import { toast } from 'sonner'

import { Products } from '../models/products.types'
import { productsService } from '../services/products.service'

import { Button } from '@/core/components/ui/button'
import { Skeleton } from '@/core/components/ui/skeleton'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { cn } from '@/core/lib/tailwind.utils'
import { useCartStore } from '@/modules/cart/store/cart.store'
import { useFavoritesStore } from '@/modules/favorites/store/favorites.store'

interface ProductsListProps {
	products: Products[]
	className?: string
	disableCart?: boolean
	disableFavorite?: boolean
}

export const ProductsList = ({
	className,
	products,
	disableCart,
	disableFavorite
}: ProductsListProps) => {
	return (
		<div
			className={cn(
				'grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-4 md:gap-x-4 md:gap-y-8 lg:grid-cols-5 lg:gap-x-5 lg:gap-y-10',
				className
			)}
		>
			{products.map(product => (
				<ProductsListItem
					key={product.id}
					product={product}
					disableCart={disableCart}
					disableFavorite={disableFavorite}
				/>
			))}
		</div>
	)
}

interface ProductsListItemProps {
	product: Products
	disableCart?: boolean
	disableFavorite?: boolean
}

export const ProductsListItem = memo(
	({ product, disableFavorite, disableCart }: ProductsListItemProps) => {
		const { addToCart, isProductInCart } = useCartStore()
		const { addFavorite, isFavorite, removeFavorite } = useFavoritesStore()

		const mutation = useMutation({
			mutationFn: (productId: string) =>
				productsService.saveVisitedProduct(productId)
		})

		const onCartClick = (event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()

			if (disableCart) return

			addToCart(product.id)
			toast.info('Товар добавлен в корзину')
		}

		const onFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
			event.stopPropagation()

			if (disableFavorite) return

			if (isFavorite(product.id)) {
				removeFavorite(product.id)
				toast.info('Товар удалён из избранного')
			} else {
				addFavorite(product.id)
				toast.info('Товар добавлен в избранное')
			}
		}

		const onProductClick = useCallback(() => {
			mutation.mutate(product.id)
		}, [mutation, product.id])

		return (
			<div className='relative flex h-full cursor-pointer flex-col justify-between'>
				<Link
					href={`/products/${product.id}`}
					onClick={onProductClick}
					className='w-full flex-grow'
				>
					<div className='relative h-72 w-full overflow-hidden rounded-xl bg-muted/50'>
						<Image
							src={getProductImageUrl(product.images[0])}
							alt={product.name}
							className='h-full w-full object-contain'
							fill
							loading='lazy'
						/>
					</div>

					<p className='mt-4 text-lg font-bold'>{formatPrice(product.price)}</p>

					<p className='mt-1 line-clamp-1 text-ellipsis text-muted-foreground'>
						{product.brand.name} / {product.subCategory.name}
					</p>

					<p className='mt-1 line-clamp-2 text-ellipsis font-medium'>
						{product.name}
					</p>
				</Link>

				<button
					type='button'
					className={cn(
						'absolute right-4 top-4',
						disableFavorite ? 'hidden' : 'block'
					)}
					onClick={onFavoriteClick}
				>
					<Heart
						className={cn(
							'h-6 opacity-60 hover:opacity-80',
							isFavorite(product.id)
								? 'fill-primary text-primary hover:text-primary/80'
								: 'text-black hover:text-primary'
						)}
						fill='#fff'
					/>
				</button>

				<div className={cn('mt-4 w-full', disableCart ? 'hidden' : 'block')}>
					{!isProductInCart(product.id) ? (
						<Button
							type='button'
							className='w-full'
							onClick={onCartClick}
						>
							<ShoppingBasket className='mr-2 h-4 w-4' />
							Добавить
						</Button>
					) : (
						<Link href='/cart'>
							<Button
								type='button'
								className='w-full bg-primary/10 text-primary hover:bg-primary/30'
							>
								В корзине
							</Button>
						</Link>
					)}
				</div>
			</div>
		)
	}
)

ProductsListItem.displayName = 'ProductsListItem'

export const ProductsSkeletonList = () => {
	return (
		<div className='grid grid-cols-2 gap-x-2 gap-y-6 md:grid-cols-4 md:gap-x-4 md:gap-y-8 lg:grid-cols-5 lg:gap-x-8 lg:gap-y-10'>
			{Array.from({ length: 10 }).map((_, i) => (
				<Skeleton
					key={i}
					className='h-72 w-full rounded-xl'
				/>
			))}
		</div>
	)
}
