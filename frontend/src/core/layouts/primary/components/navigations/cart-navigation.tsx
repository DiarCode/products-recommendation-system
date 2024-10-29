'use client'

import dynamic from 'next/dynamic'

import { ShoppingBasket } from 'lucide-react'
import { Suspense } from 'react'

import { NavLink } from '../../primary-header'

import { useCartStore } from '@/modules/cart/store/cart.store'

const CartItemsBadge = dynamic(
	() => import('./cart-nav-badge').then(m => m.CartItemsBadge),
	{ ssr: false }
)

export const CartNavigation = () => {
	const {
		cart: { items }
	} = useCartStore()

	return (
		<div className='relative'>
			<NavLink
				href='/cart'
				icon={ShoppingBasket}
				label='Корзина'
			/>
			<Suspense
				fallback={
					<div className='absolute -right-[6px] -top-0'>Loading...</div>
				}
			>
				<CartItemsBadge items={items} />
			</Suspense>
		</div>
	)
}
