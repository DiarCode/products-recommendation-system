import { useSuspenseQuery } from '@tanstack/react-query'

import { adminAnalyticsService } from '../services/admin-analytics.service'

export const ANALYTICS_STORE_STATISTICS_QUERY_KEY = 'analytics:store-statistics'

export const useAnalyticsStoreStatistics = () => {
	return useSuspenseQuery({
		queryKey: [ANALYTICS_STORE_STATISTICS_QUERY_KEY],
		queryFn: () => adminAnalyticsService.getStoresStatistics()
	})
}
