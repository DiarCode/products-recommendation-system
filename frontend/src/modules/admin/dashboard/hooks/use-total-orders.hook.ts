import { useSuspenseQuery } from '@tanstack/react-query'

import { adminAnalyticsService } from '../services/admin-analytics.service'

export const ANALYTICS_TOTAL_ORDERS_QUERY_KEY = 'analytics:total-order-count'

export const useAnalyticsTotalOrders = () => {
	return useSuspenseQuery({
		queryKey: [ANALYTICS_TOTAL_ORDERS_QUERY_KEY],
		queryFn: () => adminAnalyticsService.getTotalOrdersForCurrentMonth()
	})
}
