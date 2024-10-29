import { useSuspenseQuery } from '@tanstack/react-query'

import { PaginateQuery } from '@/core/models/paginate.types'
import { ordersService } from '@/modules/orders/services/orders.service'

export const ADMIN_ORDERS_QUERY_KEY = 'admin-orders:all'

export const useAdminOrders = (query?: PaginateQuery) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_ORDERS_QUERY_KEY, query],
		queryFn: () => ordersService.getAllOrders({ query })
	})
}

export const ADMIN_ORDER_DETAILS_QUERY_KEY = 'admin-orders:details'

export const useAdminOrder = (id: string) => {
	return useSuspenseQuery({
		queryKey: [ADMIN_ORDER_DETAILS_QUERY_KEY, id],
		queryFn: () => ordersService.getOrderById(id)
	})
}
