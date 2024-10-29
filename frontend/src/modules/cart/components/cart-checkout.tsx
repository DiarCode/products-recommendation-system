import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'
import { toast } from 'sonner'

import { CartItem } from '../models/cart.types'
import { useCartStore } from '../store/cart.store'

import { Button } from '@/core/components/ui/button'
import { getPage } from '@/core/config/pages.config'
import { REDIRECT_TO_PARAM_NAME } from '@/core/constants/routes.constant'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { formatPrice } from '@/core/lib/price.utils'
import { cn } from '@/core/lib/tailwind.utils'
import { useAddress } from '@/modules/address/hooks/use-address.hook'
import { Address } from '@/modules/address/models/address.types'
import { useCurrentUser } from '@/modules/auth/hooks/user-current-user.hook'
import { MY_ORDERS_QUERY_KEY } from '@/modules/orders/hooks/use-my-orders.hook'
import {
	CreateOrderDto,
	CreateOrderItemDto
} from '@/modules/orders/models/order-dto.types'
import { Orders } from '@/modules/orders/models/orders.types'
import { ordersService } from '@/modules/orders/services/orders.service'

const SelectAddressDialog = dynamic(() =>
	import('@/modules/address/components/select-address-dialog').then(
		m => m.SelectAddressDialog
	)
)

interface CartCheckoutProps {
	className?: string
	cartItems: CartItem[]
	discount?: number
	addressId: string | null
}

export const CartCheckout = ({
	className,
	cartItems,
	discount = 0,
	addressId
}: CartCheckoutProps) => {
	const { data: address } = useAddress(addressId)
	const { data: currentUser } = useCurrentUser()
	const { setAddress, clearCart } = useCartStore()
	const { isOpen, toggleDialog } = useDialog()
	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate: createOrder, isPending: isOrderCreating } = useMutation({
		mutationFn: (dto: CreateOrderDto) => ordersService.createOrder(dto),
		onSuccess: (order: Orders) => {
			toast.success('Ваш заказ успешно создат')
			queryClient.invalidateQueries({ queryKey: [MY_ORDERS_QUERY_KEY] })
			clearCart()
			router.push(`${getPage('PROFILE_ORDERS').href}/${order.id}`)
		},
		onError: () => {
			toast.error('Произошла ошибка при создании заказа')
		}
	})

	const totalPrice = cartItems.reduce(
		(total, item) => total + item.product.price * item.quantity,
		0
	)
	const discountedPrice = totalPrice - discount

	const onSelectAddress = (address: Address) => {
		toggleDialog()
		setAddress(address.id)
	}

	const redirectToLogin = () => {
		router.push(`/login?${REDIRECT_TO_PARAM_NAME}=/cart`)
	}

	const handleCheckout = () => {
		if (!address) {
			return toast.warning('Заполните адрес перед созданием заказа')
		}

		const orderItems: CreateOrderItemDto[] = cartItems.map(cartItem => ({
			productId: cartItem.product.id,
			quantity: cartItem.quantity
		}))

		const dto: CreateOrderDto = {
			addressId: address.id,
			orderItems
		}

		createOrder(dto)
	}

	return (
		<div className={cn('', className)}>
			<Suspense fallback={<p>Загрузка...</p>}>
				{!address ? (
					<Button
						onClick={
							currentUser ? () => toggleDialog() : () => redirectToLogin()
						}
						variant='link'
						className='mb-3 p-0'
					>
						{currentUser
							? 'Выбрать адрес для доставки'
							: 'Войдите для выбора адреса'}
					</Button>
				) : (
					<div className='mb-2 flex items-center justify-between gap-4'>
						<div>Ваш адрес доставки:</div>

						<Button
							onClick={toggleDialog}
							variant='link'
							className='p-0'
						>
							{`${address.city}, ${address.address}`}
						</Button>
					</div>
				)}
			</Suspense>

			{isOpen && (
				<SelectAddressDialog
					isOpen={isOpen}
					toggleDialog={toggleDialog}
					onSelectAddress={onSelectAddress}
				/>
			)}

			<ul className='flex flex-col gap-3'>
				<li className='flex items-center justify-between gap-2'>
					<p>
						Товары (
						{cartItems.reduce((total, item) => total + item.quantity, 0)})
					</p>
					<p>{formatPrice(totalPrice)}</p>
				</li>

				{discount > 0 && (
					<li className='flex items-center justify-between gap-2'>
						<p>Скидка</p>
						<p>- {formatPrice(discount)}</p>
					</li>
				)}

				<li className='flex items-center justify-between gap-2'>
					<p className='text-2xl font-bold'>Итого</p>
					<p className='text-2xl font-bold'>{formatPrice(discountedPrice)}</p>
				</li>
			</ul>

			<Button
				disabled={!address || !currentUser || isOrderCreating}
				onClick={currentUser ? () => handleCheckout() : () => redirectToLogin()}
				className='mt-6 w-full rounded-xl py-6 text-base font-semibold'
			>
				{!isOrderCreating ? 'Заказать' : 'Создаем ваш заказ...'}
			</Button>
		</div>
	)
}
