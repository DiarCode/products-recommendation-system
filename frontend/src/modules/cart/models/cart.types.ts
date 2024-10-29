import { Address } from '@/modules/address/models/address.types'
import { Products } from '@/modules/products/models/products.types'

export interface CartItem {
	product: Products
	quantity: number
}

export interface Cart {
	address: Address | null
	items: CartItem[]
}

export interface StoredCart {
	addressId: string | null
	items: StoredCartItem[]
}

export interface StoredCartItem {
	productId: string
	quantity: number
}
