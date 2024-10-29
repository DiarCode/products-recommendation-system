'use client'

import Image from 'next/image'

import { Heart, Minus, Plus, Trash } from 'lucide-react'
import { memo } from 'react'
import { toast } from 'sonner'

import { CartItem } from '../models/cart.types'
import { useCartStore } from '../store/cart.store'

import { Button } from '@/core/components/ui/button'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { cn } from '@/core/lib/tailwind.utils'

interface CartItemsListProps {
	cartItems: CartItem[]
	className?: string
}

export const CartItemsList = ({ cartItems, className }: CartItemsListProps) => {
	return (
		<div className={cn('flex flex-col gap-6', className)}>
			{cartItems.map(cartItem => (
				<CartListItem
					key={cartItem.product.id}
					cartItem={cartItem}
				/>
			))}
		</div>
	)
}

interface CartListItemProps {
	className?: string
	cartItem: CartItem
}

export const CartListItem = memo(
	({ className, cartItem }: CartListItemProps) => {
		const { removeFromCart, increaseQuantity, decreaseQuantity } =
			useCartStore()
		const { quantity, product } = cartItem

		const totalPrice = product.price * quantity

		const onRemoveFromCart = () => {
			removeFromCart(product.id)
			toast.info('Товар удален из корзины')
		}

		return (
			<div className={cn('group grid grid-cols-7 gap-4', className)}>
				<div className='col-span-3 md:col-span-1'>
					<div className='relative h-32 w-full overflow-clip rounded-xl bg-muted/50'>
						<Image
							src={getProductImageUrl(product.images[0])}
							alt={product.name}
							className='object-contain'
							loading='lazy'
							fill
						/>
					</div>
				</div>

				<div className='col-span-4 md:col-span-3'>
					<p className='mb-1 text-base font-bold md:hidden'>
						{formatPrice(totalPrice)}
					</p>

					<p className='text-sm md:text-base'>{product.name}</p>
					<p className='mt-1 text-muted-foreground'>
						{product.brand.name} / {product.subCategory.name}
					</p>
				</div>

				<div className='col-span-full md:col-span-1'>
					<div className='flex items-center justify-between gap-4'>
						<div className='flex items-center'>
							<Button
								size='icon'
								variant='secondary'
								className='flex-shrink-0 rounded-lg'
								onClick={() => decreaseQuantity(product.id)}
							>
								<Minus className='h-4 w-4' />
							</Button>

							<input
								className='w-12 border-none text-center text-base'
								value={quantity}
								min={1}
							/>

							<Button
								size='icon'
								variant='secondary'
								className='flex-shrink-0 rounded-lg'
								onClick={() => increaseQuantity(product.id)}
							>
								<Plus className='h-4 w-4' />
							</Button>
						</div>

						<div className='flex items-center text-muted-foreground opacity-60 md:hidden'>
							<Button
								size='icon'
								variant='ghost'
								disabled
							>
								<Heart className='h-6 w-6' />
							</Button>

							<Button
								size='icon'
								variant='ghost'
								onClick={onRemoveFromCart}
							>
								<Trash className='h-6 w-6' />
							</Button>
						</div>
					</div>
				</div>

				<div className='hidden md:col-span-2 md:block'>
					<div className='flex flex-col items-end'>
						<p className='text-xl font-bold'>{formatPrice(totalPrice)}</p>

						<div className='mt-3 hidden items-center text-muted-foreground opacity-60 group-hover:flex'>
							<Button
								size='icon'
								variant='ghost'
								disabled
							>
								<Heart className='h-5 w-5' />
							</Button>

							<Button
								size='icon'
								variant='ghost'
								onClick={onRemoveFromCart}
							>
								<Trash className='h-5 w-5' />
							</Button>
						</div>
					</div>
				</div>
			</div>
		)
	}
)

CartListItem.displayName = 'CartListItem'
