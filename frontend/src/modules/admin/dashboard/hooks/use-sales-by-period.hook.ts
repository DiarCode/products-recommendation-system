import { useSuspenseQuery } from '@tanstack/react-query'

import { SALES_PERIODS } from '../models/admin-analytics-dto.types'
import { adminAnalyticsService } from '../services/admin-analytics.service'

export const ANALYTICS_SALES_BY_PERIOD_QUERY_KEY =
	'analytics:get-sales-by-period-type'

export const useAnalyticsSalesByPeriod = (
	selectedPeriodType: SALES_PERIODS
) => {
	return useSuspenseQuery({
		queryKey: [ANALYTICS_SALES_BY_PERIOD_QUERY_KEY, { selectedPeriodType }],
		queryFn: () =>
			adminAnalyticsService.getSalesByPeriodType(selectedPeriodType)
	})
}
