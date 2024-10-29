'use client'

import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'

import {
	ADMIN_ORDERS_QUERY_KEY,
	ADMIN_ORDER_DETAILS_QUERY_KEY
} from '../../hooks/use-admin-orders.hook'

import { Button } from '@/core/components/ui/button'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import { UpdateOrderDto } from '@/modules/orders/models/order-dto.types'
import {
	ORDER_STATUS_FORMATTED,
	OrderStatus,
	Orders
} from '@/modules/orders/models/orders.types'
import { ordersService } from '@/modules/orders/services/orders.service'
import { formatOrderDate } from '@/modules/orders/utils/format-date.util'

interface AdminOrderDetailsHeaderProps {
	order: Orders
}

export const AdminOrderDetailsHeader = ({
	order
}: AdminOrderDetailsHeaderProps) => {
	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate } = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateOrderDto }) =>
			ordersService.updateOrder(id, dto),
		onSuccess: () => {
			toast.success('Статус обновлен')
			queryClient.invalidateQueries({ queryKey: [ADMIN_ORDERS_QUERY_KEY] })
			queryClient.invalidateQueries({
				queryKey: [ADMIN_ORDER_DETAILS_QUERY_KEY, order.id]
			})
		},
		onError: () => {
			toast.error('Ошибка при обновлении статуса')
		}
	})

	const onStatusChange = (newStatus: string) => {
		mutate({ id: order.id, dto: { status: newStatus as OrderStatus } })
	}

	return (
		<div className='flex items-start justify-between gap-4'>
			<div>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-7 w-7 bg-background'
						onClick={() => router.back()}
						type='button'
					>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Назад</span>
					</Button>

					<h1 className='text-3xl font-bold'>
						Заказ от {formatOrderDate(order.createdAt)}
					</h1>

					<Select
						onValueChange={onStatusChange}
						defaultValue={order.status}
					>
						<SelectTrigger className='h-8 w-fit gap-3 rounded-lg bg-primary px-4 py-2 text-primary-foreground'>
							<SelectValue placeholder='Статус заказа' />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>Статусы</SelectLabel>
								{Object.entries(ORDER_STATUS_FORMATTED).map(([key, value]) => (
									<SelectItem
										key={key}
										value={key}
									>
										{value}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<Button variant='link'>Счет на оплату</Button>
			</div>
		</div>
	)
}
