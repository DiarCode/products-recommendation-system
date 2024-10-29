'use client'

import Link from 'next/link'

import { Suspense } from 'react'

import { useFetchedCart } from '../hooks/use-cart.hooks'
import { useCartStore } from '../store/cart.store'

import { CartCheckout } from './cart-checkout'
import { CartItemsList } from './cart-items-list'
import { Button } from '@/core/components/ui/button'
import { Skeleton } from '@/core/components/ui/skeleton'

export const CartView = () => {
	const { cart } = useCartStore()
	const { data: fetchedCart } = useFetchedCart(cart.items)

	return (
		<Suspense fallback={<Skeleton className='h-40 w-full rounded-xl' />}>
			{fetchedCart.length > 0 ? (
				<div className='relative grid gap-10 pb-10 md:grid-cols-10 md:pt-6'>
					<div className='col-span-full lg:col-span-7'>
						<h1 className='text-2xl font-bold'>Корзина</h1>
						<p className='mt-1'>{fetchedCart.length} товара</p>

						<CartItemsList
							className='mt-6'
							cartItems={fetchedCart}
						/>
					</div>

					<div className='col-span-full border-t lg:col-span-3 lg:border-l lg:border-t-0'>
						<CartCheckout
							cartItems={fetchedCart}
							addressId={cart.addressId}
							className='sticky top-20 pt-4 lg:pl-10 lg:pt-0'
						/>
					</div>
				</div>
			) : (
				<div className='mt-12 flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-2xl font-bold'>
							В корзине пока пусто
						</h1>
						<h2 className='mt-4 text-center'>
							Загляните на главную, чтобы выбрать товары или найдите нужное в
							поиске
						</h2>
						<div className='mt-8 flex justify-center'>
							<Link href='/'>
								<Button>Перейти на главную</Button>
							</Link>
						</div>
					</div>
				</div>
			)}
		</Suspense>
	)
}
