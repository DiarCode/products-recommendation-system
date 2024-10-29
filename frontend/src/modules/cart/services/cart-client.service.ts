import { CartItem, StoredCartItem } from '../models/cart.types'

import { productsService } from '@/modules/products/services/products.service'

class CartClientService {
	async fetchCartProducts(cart: StoredCartItem[]): Promise<CartItem[]> {
		const productIds = cart.map(item => item.productId)

		if (productIds.length === 0) {
			return []
		}

		const products = await productsService.getProductsByIds(productIds)

		return products.map(product => ({
			product,
			quantity: cart.find(item => item.productId === product.id)?.quantity || 1
		}))
	}
}

export const cartClientService = new CartClientService()
