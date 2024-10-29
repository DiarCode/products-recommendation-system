import { cookies } from 'next/headers'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { OrdersList } from '@/modules/orders/components/orders-list'
import { MY_ORDERS_QUERY_KEY } from '@/modules/orders/hooks/use-my-orders.hook'
import { ordersService } from '@/modules/orders/services/orders.service'

export const metadata: Metadata = {
	title: 'Заказы'
}

export default function OrdersListPage() {
	const queryClient = getQueryClient()
	const token = cookies().get(Tokens.ACCESS)?.value

	queryClient.prefetchQuery({
		queryKey: [MY_ORDERS_QUERY_KEY],
		queryFn: () => ordersService.getMyOrders({ token })
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<OrdersList />
		</HydrationBoundary>
	)
}
