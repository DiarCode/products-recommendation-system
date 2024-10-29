'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { StoredCart } from '../models/cart.types'

interface CartState {
	cart: StoredCart
}

export type CartActions = {
	addToCart: (productId: string, quantity?: number) => void
	removeFromCart: (productId: string) => void
	clearCart: () => void
	increaseQuantity: (productId: string) => void
	decreaseQuantity: (productId: string) => void
	updateQuantity: (productId: string, amount: number) => void
	isProductInCart: (productId: string) => boolean
	setAddress: (addressId: string) => void
}

export type CartStore = CartState & CartActions

const initialCart: StoredCart = {
	addressId: null,
	items: []
}

export const useCartStore = create<CartStore>()(
	persist(
		(set, get) => ({
			cart: initialCart,

			addToCart: (productId: string, quantity: number = 1) => {
				set(state => {
					const existingItem = state.cart.items.find(
						item => item.productId === productId
					)
					let newCartItems = [...state.cart.items]

					if (existingItem) {
						existingItem.quantity += quantity
					} else {
						newCartItems.push({ productId, quantity })
					}

					return { cart: { ...state.cart, items: newCartItems } }
				})
			},

			removeFromCart: (productId: string) => {
				set(state => {
					const newCartItems = state.cart.items.filter(
						item => item.productId !== productId
					)
					return { cart: { ...state.cart, items: newCartItems } }
				})
			},

			isProductInCart: (productId: string) => {
				return get().cart.items.some(item => item.productId === productId)
			},

			increaseQuantity: (productId: string) => {
				set(state => {
					const newCartItems = state.cart.items.map(item =>
						item.productId === productId
							? { ...item, quantity: item.quantity + 1 }
							: item
					)
					return { cart: { ...state.cart, items: newCartItems } }
				})
			},

			decreaseQuantity: (productId: string) => {
				set(state => {
					const newCartItems = state.cart.items.map(item =>
						item.productId === productId
							? { ...item, quantity: Math.max(1, item.quantity - 1) }
							: item
					)
					return { cart: { ...state.cart, items: newCartItems } }
				})
			},

			updateQuantity: (productId: string, amount: number) => {
				const validAmount = amount < 0 ? 1 : amount

				set(state => {
					const newCartItems = state.cart.items.map(item =>
						item.productId === productId
							? { ...item, quantity: validAmount }
							: item
					)
					return { cart: { ...state.cart, items: newCartItems } }
				})
			},

			clearCart: () => {
				set({ cart: { addressId: null, items: [] } })
			},

			setAddress: (addressId: string) => {
				set(state => ({ cart: { ...state.cart, addressId } }))
			}
		}),
		{
			name: 'ggnet-cart'
		}
	)
)
