import { useSuspenseQuery } from '@tanstack/react-query'

import { adminAnalyticsService } from '../services/admin-analytics.service'

export const ANALYTICS_AVG_SALES_QUERY_KEY = 'analytics:avg-sales'

export const useAnalyticsAverageSales = () => {
	return useSuspenseQuery({
		queryKey: [ANALYTICS_AVG_SALES_QUERY_KEY],
		queryFn: () => adminAnalyticsService.getAverageDailySalesForCurrentMonth()
	})
}
