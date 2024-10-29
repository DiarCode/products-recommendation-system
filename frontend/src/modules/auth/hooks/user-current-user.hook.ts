import { useSuspenseQuery } from '@tanstack/react-query'

import { authService } from '../services/auth.service'

export const CURRENT_USER_QUERY_KEY = 'auth:current-user'

export const useCurrentUser = () => {
	return useSuspenseQuery({
		queryKey: [CURRENT_USER_QUERY_KEY],
		queryFn: () => authService.getCurrent()
	})
}
