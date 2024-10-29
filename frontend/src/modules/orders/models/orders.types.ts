import { Products } from '@/modules/products/models/products.types'
import { User } from '@/modules/users/models/users.types'

export enum OrderStatus {
	PENDING = 'PENDING',
	CONFIRMED = 'CONFIRMED',
	SHIPPED = 'SHIPPED',
	DELIVERED = 'DELIVERED',
	CANCELED = 'CANCELED'
}

export const OrderFilterStatus = {
	ALL: 'ALL',
	ACTIVE: 'ACTIVE',
	PENDING: 'PENDING',
	CONFIRMED: 'CONFIRMED',
	SHIPPED: 'SHIPPED',
	DELIVERED: 'DELIVERED',
	CANCELED: 'CANCELED'
} as const

export const ORDER_STATUS_FORMATTED: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'Ожидает подтверждения',
	[OrderStatus.CONFIRMED]: 'Подтвержден',
	[OrderStatus.SHIPPED]: 'Прибыл',
	[OrderStatus.DELIVERED]: 'Доставлен',
	[OrderStatus.CANCELED]: 'Отменен'
}

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
	[OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-100',
	[OrderStatus.CONFIRMED]: 'text-green-500 bg-green-100',
	[OrderStatus.SHIPPED]: 'text-blue-600 bg-blue-100',
	[OrderStatus.DELIVERED]: 'text-emerald-600 bg-emerald-200',
	[OrderStatus.CANCELED]: 'text-red-600 bg-red-100'
}

export interface OrderItems {
	id: string
	name: string
	productId: string
	product: Products
	quantity: number
	price: number
	orderId: string
}

export interface OrderAddress {
	country: string
	city: string
	address: string
}

export interface Orders {
	id: string
	orderItemsId: string[]
	orderItems: OrderItems[]
	totalPrice: number
	status: OrderStatus
	address: OrderAddress
	userId: string
	createdAt: Date
	user: User
	updatedAt: Date
	isPaid: boolean
	notes?: string
}
