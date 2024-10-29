import { cookies } from 'next/headers'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { AdminOrderDetailsCustomer } from '@/modules/admin/orders/components/details/admin-order-customer'
import { AdminOrderDetailsDelivery } from '@/modules/admin/orders/components/details/admin-order-delivery'
import { AdminOrderDetailsHeader } from '@/modules/admin/orders/components/details/admin-order-details-header'
import { AdminOrderDetailsPayment } from '@/modules/admin/orders/components/details/admin-order-payment'
import { AdminOrderDetailsProducts } from '@/modules/admin/orders/components/details/admin-order-products'
import { ADMIN_ORDER_DETAILS_QUERY_KEY } from '@/modules/admin/orders/hooks/use-admin-orders.hook'
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { ordersService } from '@/modules/orders/services/orders.service'
import { formatOrderDate } from '@/modules/orders/utils/format-date.util'

export async function generateMetadata({
	params
}: AdminOrderDetailsPageProps): Promise<Metadata> {
	const id = params.id

	const order = await ordersService.getMyOrderById(id)

	return {
		title: order
			? `Заказ от ${formatOrderDate(order.createdAt)}`
			: 'Детали заказа'
	}
}

interface AdminOrderDetailsPageProps {
	params: { id: string }
}

export default async function AdminOrderDetailsPage({
	params: { id }
}: AdminOrderDetailsPageProps) {
	const queryClient = getQueryClient()
	const token = cookies().get(Tokens.ACCESS)?.value

	const order = await ordersService.getOrderById(id, token)

	await queryClient.prefetchQuery({
		queryKey: [ADMIN_ORDER_DETAILS_QUERY_KEY, id],
		queryFn: () => ordersService.getOrderById(id, token),
		initialData: order
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{order ? (
				<div className='mx-auto max-w-[64rem]'>
					<AdminOrderDetailsHeader order={order} />

					<div className='mt-8 grid grid-cols-3 gap-4'>
						<AdminOrderDetailsDelivery order={order} />

						<AdminOrderDetailsPayment order={order} />

						<AdminOrderDetailsCustomer order={order} />
					</div>

					<div className='mt-4'>
						<AdminOrderDetailsProducts order={order} />
					</div>
				</div>
			) : (
				<div className='mt-12 flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-2xl font-bold'>Заказ не найден</h1>
						<h2 className='mt-4 text-center'>
							Пожалуйста, проверьте правильность пути или выберите другой заказ
							из списка.
						</h2>
					</div>
				</div>
			)}
		</HydrationBoundary>
	)
}
