import { CreditCard } from 'lucide-react'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { formatPrice } from '@/core/lib/price.utils'
import { Orders } from '@/modules/orders/models/orders.types'

interface AdminOrderDetailsPaymentProps {
	order: Orders
}

export const AdminOrderDetailsPayment = ({
	order
}: AdminOrderDetailsPaymentProps) => {
	return (
		<Card className='shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-lg font-bold'>
					<CreditCard className='h-5 w-5' />
					{order.isPaid ? 'Оплачено' : 'Ожидает оплаты'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col gap-3'>
					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Товары</p>
						<p className='flex justify-end text-end'>
							{formatPrice(order.totalPrice)}
						</p>
					</div>

					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Доставка</p>
						<p className='flex justify-end text-end'>Бесплатно</p>
					</div>

					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Итого</p>
						<p className='flex justify-end text-end'>
							{formatPrice(order.totalPrice)}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
