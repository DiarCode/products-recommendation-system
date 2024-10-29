import { useSuspenseQuery } from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'

import { PaginateQuery } from '@/core/models/paginate.types'

export const MY_ORDERS_QUERY_KEY = 'my-orders:all'

export const useMyOrders = (query?: PaginateQuery) => {
	return useSuspenseQuery({
		queryKey: [MY_ORDERS_QUERY_KEY, query],
		queryFn: () => ordersService.getMyOrders({ query })
	})
}
