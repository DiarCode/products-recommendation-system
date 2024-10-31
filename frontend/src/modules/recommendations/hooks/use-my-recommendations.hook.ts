import { useSuspenseQuery } from '@tanstack/react-query'

import { recommendationsService } from '../services/recommendations.service'

export const RECOMMENDATIONS_QUERY_KEY = 'recommendations:all'

export const useMyRecommendations = () => {
	return useSuspenseQuery({
		queryKey: [RECOMMENDATIONS_QUERY_KEY],
		queryFn: () => recommendationsService.getMyRecommendations()
	})
}
