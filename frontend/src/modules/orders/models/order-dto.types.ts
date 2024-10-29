import { OrderStatus } from './orders.types'
import { PaginateQuery } from '@/core/models/paginate.types'

export interface CreateOrderItemDto {
	productId: string
	quantity: number
}

export interface CreateOrderDto {
	addressId: string
	orderItems: CreateOrderItemDto[]
}

export interface GetOrdersDto {
	query?: PaginateQuery
	token?: string
}

export interface UpdateOrderDto {
	addressId?: string
	status?: OrderStatus
}
