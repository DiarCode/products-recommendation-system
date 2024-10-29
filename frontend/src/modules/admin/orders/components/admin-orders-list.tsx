'use client'

import { useRouter } from 'next/navigation'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Check, X } from 'lucide-react'
import { Suspense, useState } from 'react'

import { useAdminOrders } from '../hooks/use-admin-orders.hook'

import { Button } from '@/core/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { DEFAULT_LIMIT } from '@/core/lib/pagintation.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { cn } from '@/core/lib/tailwind.utils'
import { PaginateQuery } from '@/core/models/paginate.types'
import {
	ORDER_STATUS_COLOR,
	ORDER_STATUS_FORMATTED
} from '@/modules/orders/models/orders.types'
import { getUserFullName } from '@/modules/users/utils/users-format.utils'

interface AdminOrdersListProps {
	query?: PaginateQuery
}

export const AdminOrdersList = ({ query }: AdminOrdersListProps) => {
	const [limit, setLimit] = useState(DEFAULT_LIMIT)

	const router = useRouter()
	const { data: orders } = useAdminOrders({ ...query, limit })

	const handleLoadMore = () => {
		const leftItemsCount = orders.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{orders.data.length === 0 && (
				<p className='text-muted-foreground'>Заказы не найдены</p>
			)}
			{orders.data.length > 0 && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Создано</TableHead>
							<TableHead>Заказчик</TableHead>
							<TableHead>Сумма</TableHead>
							<TableHead className='hidden md:table-cell'>Оплата</TableHead>
							<TableHead className='hidden md:table-cell'>Статус</TableHead>
							<TableHead className='hidden md:table-cell'>
								Комментарий
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{orders.data.map(order => (
							<TableRow
								key={order.id}
								className='h-12 cursor-pointer'
								onClick={() => router.push(`/admin/orders/${order.id}`)}
							>
								<TableCell className='font-medium'>
									{format(new Date(order.createdAt), 'dd MMMM yyyy', {
										locale: ru
									})}
								</TableCell>

								<TableCell className='font-medium'>
									{getUserFullName(order.user)}
								</TableCell>

								<TableCell className='font-medium'>
									{formatPrice(order.totalPrice)}
								</TableCell>

								<TableCell className='hidden font-medium md:table-cell'>
									{order.isPaid ? (
										<div className='flex items-center gap-2 text-green-500'>
											<Check className='h-4 w-4' />
											Оплачено
										</div>
									) : (
										<div className='flex items-center gap-2 text-red-500'>
											<X className='h-4 w-4' />
											Не оплачено
										</div>
									)}
								</TableCell>

								<TableCell className='hidden font-medium md:table-cell'>
									<p
										className={cn(
											'inline-flex w-fit items-center rounded-md px-2.5 py-1 text-xs',
											ORDER_STATUS_COLOR[order.status]
										)}
									>
										{ORDER_STATUS_FORMATTED[order.status]}
									</p>
								</TableCell>

								<TableCell className='hidden font-medium md:table-cell'>
									<p className='max-w-60 truncate'>{order.notes}</p>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{orders.meta.totalItems - limit > 0 && (
				<div className='mt-6 flex justify-center'>
					<Button
						variant='ghost'
						className='text-primary'
						onClick={handleLoadMore}
					>
						Еще
					</Button>
				</div>
			)}
		</Suspense>
	)
}
