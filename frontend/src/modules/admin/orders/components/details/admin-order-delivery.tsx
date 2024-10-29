import { MapPin } from 'lucide-react'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Orders } from '@/modules/orders/models/orders.types'

interface AdminOrderDetailsDeliveryProps {
	order: Orders
}

export const AdminOrderDetailsDelivery = ({
	order
}: AdminOrderDetailsDeliveryProps) => {
	return (
		<Card className='shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-lg font-bold'>
					<MapPin className='h-5 w-5' />
					Доставка
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col gap-3'>
					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Страна</p>
						<p className='flex justify-end text-end'>{order.address.country}</p>
					</div>

					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Город</p>
						<p className='flex justify-end text-end'>{order.address.city}</p>
					</div>

					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Адрес</p>
						<p className='flex justify-end text-end'>{order.address.address}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
