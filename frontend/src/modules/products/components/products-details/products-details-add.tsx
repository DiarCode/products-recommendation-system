'use client'

import Link from 'next/link'

import { Suspense } from 'react'
import { toast } from 'sonner'

import { Products } from '../../models/products.types'

import { Button } from '@/core/components/ui/button'
import { Skeleton } from '@/core/components/ui/skeleton'
import { formatPrice } from '@/core/lib/price.utils'
import { cn } from '@/core/lib/tailwind.utils'
import { useCartStore } from '@/modules/cart/store/cart.store'

interface ProductsDetailsAddProps {
	className?: string
	product: Products
}

export const ProductsDetailsAdd = ({
	className,
	product
}: ProductsDetailsAddProps) => {
	const { addToCart, isProductInCart } = useCartStore()

	const onAddClick = () => {
		addToCart(product.id)
		toast.info('Товар добавлен в корзину')
	}

	return (
		<Suspense fallback={<Skeleton className='h-32 w-full rounded-2xl' />}>
			<div className={cn('rounded-2xl p-4 shadow-2xl', className)}>
				<p className='text-3xl font-bold text-primary'>
					{formatPrice(product.price)}
				</p>

				<div className='mt-5'>
					{!isProductInCart(product.id) ? (
						<Button
							onClick={onAddClick}
							className='w-full rounded-xl py-6 text-base font-semibold'
						>
							Добавить в корзину
						</Button>
					) : (
						<Link href='/cart'>
							<Button className='w-full rounded-xl bg-primary/20 py-6 text-base font-semibold text-primary hover:bg-primary/30'>
								В корзине
							</Button>
						</Link>
					)}
				</div>
			</div>
		</Suspense>
	)
}
