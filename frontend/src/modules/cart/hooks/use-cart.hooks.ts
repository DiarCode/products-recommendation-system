import { useSuspenseQuery } from '@tanstack/react-query'

import { StoredCartItem } from '../models/cart.types'
import { cartClientService } from '../services/cart-client.service'

export const CART_QUERY_KEY = 'cart:all'

export const useFetchedCart = (cartItems: StoredCartItem[]) => {
	return useSuspenseQuery({
		queryKey: [CART_QUERY_KEY, cartItems],
		queryFn: () => cartClientService.fetchCartProducts(cartItems)
	})
}
