import { useSuspenseQuery } from '@tanstack/react-query'

import { adminAnalyticsService } from '../services/admin-analytics.service'

export const ANALYTICS_TOTAL_SALES_QUERY_KEY = 'analytics:total-sales'

export const useAnalyticsTotalSales = () => {
	return useSuspenseQuery({
		queryKey: [ANALYTICS_TOTAL_SALES_QUERY_KEY],
		queryFn: () => adminAnalyticsService.getTotalSalesForCurrentMonth()
	})
}
