'use client'

import { Badge } from '@/core/components/ui/badge'
import { useFetchedCart } from '@/modules/cart/hooks/use-cart.hooks'
import { StoredCartItem } from '@/modules/cart/models/cart.types'

interface CartItemsBadgeProps {
	items: StoredCartItem[]
}

export const CartItemsBadge = ({ items }: CartItemsBadgeProps) => {
	const { data: fetchedCartItems } = useFetchedCart(items)

	return (
		<div className='absolute -right-[6px] -top-0'>
			{fetchedCartItems.length > 0 && (
				<Badge
					className='h-4 p-[6px] text-[10px]'
					variant='destructive'
				>
					{fetchedCartItems.length}
				</Badge>
			)}
		</div>
	)
}

export default CartItemsBadge
