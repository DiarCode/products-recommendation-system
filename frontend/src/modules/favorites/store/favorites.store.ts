import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
	favoriteProductIds: string[]
}

interface FavoritesActions {
	addFavorite: (productId: string) => void
	removeFavorite: (productId: string) => void
	clearFavorites: () => void
	isFavorite: (productId: string) => boolean
	getFavorites: () => string[]
}

type FavoritesStore = FavoritesState & FavoritesActions

export const useFavoritesStore = create<FavoritesStore>()(
	persist(
		(set, get) => ({
			favoriteProductIds: [],

			addFavorite: (productId: string) => {
				set(state => {
					if (!state.favoriteProductIds.includes(productId)) {
						return {
							favoriteProductIds: [...state.favoriteProductIds, productId]
						}
					}
					return state
				})
			},

			removeFavorite: (productId: string) => {
				set(state => ({
					favoriteProductIds: state.favoriteProductIds.filter(
						id => id !== productId
					)
				}))
			},

			clearFavorites: () => {
				set({ favoriteProductIds: [] })
			},

			isFavorite: (productId: string) => {
				return get().favoriteProductIds.includes(productId)
			},

			getFavorites: () => {
				return get().favoriteProductIds
			}
		}),
		{
			name: 'ggnet-favorites-products'
		}
	)
)
