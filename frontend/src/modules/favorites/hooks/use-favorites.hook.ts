import { useSuspenseQuery } from '@tanstack/react-query'

import { useFavoritesStore } from '../store/favorites.store'

import { productsService } from '@/modules/products/services/products.service'

export const FAVORITES_QUERY_KEY = 'favorites:all'

export const useFetchedFavorites = () => {
	const { favoriteProductIds } = useFavoritesStore()

	return useSuspenseQuery({
		queryKey: [FAVORITES_QUERY_KEY, favoriteProductIds],
		queryFn: () => productsService.getProductsByIds(favoriteProductIds)
	})
}
