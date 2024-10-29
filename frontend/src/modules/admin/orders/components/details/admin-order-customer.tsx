import { User } from 'lucide-react'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Orders } from '@/modules/orders/models/orders.types'
import { getUserFullName } from '@/modules/users/utils/users-format.utils'

interface AdminOrderDetailsCustomerProps {
	order: Orders
}

export const AdminOrderDetailsCustomer = ({
	order
}: AdminOrderDetailsCustomerProps) => {
	return (
		<Card className='shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-lg font-bold'>
					<User className='h-5 w-5' />
					Заказчик
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col gap-3'>
					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Имя</p>
						<p className='flex justify-end text-end'>
							{getUserFullName(order.user)}
						</p>
					</div>

					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Телефон</p>
						<p className='flex justify-end text-end'>{order.user.phone}</p>
					</div>

					<div className='grid grid-cols-2 justify-between gap-10'>
						<p className='font-bold'>Комментарий</p>
						<p className='flex justify-end text-end'>{order.notes}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
