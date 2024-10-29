import { useSuspenseQuery } from '@tanstack/react-query'

import { ordersService } from '../services/orders.service'

export const MY_ORDER_DETAILS_QUERY_KEY = 'my-orders:details'

export const useMyOrderDetails = (id: string) => {
	return useSuspenseQuery({
		queryKey: [MY_ORDER_DETAILS_QUERY_KEY, id],
		queryFn: () => ordersService.getMyOrderById(id)
	})
}
