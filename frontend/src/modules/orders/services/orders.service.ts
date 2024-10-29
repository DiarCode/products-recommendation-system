import { CreateOrderDto, UpdateOrderDto } from '../models/order-dto.types'
import { Orders } from '../models/orders.types'

import { GetOrdersDto } from './../models/order-dto.types'
import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'
import { getPaginationMeta } from '@/core/lib/pagintation.utils'
import { Paginated } from '@/core/models/paginate.types'
import { Tokens } from '@/modules/auth/models/auth-dto.types'

class OrdersService {
	private readonly baseUrl = `/api/v1/orders`

	async createOrder(dto: CreateOrderDto): Promise<Orders> {
		return fetchWrapper.post<Orders>(this.baseUrl, dto)
	}

	async updateOrder(id: string, dto: UpdateOrderDto): Promise<void> {
		return fetchWrapper.put<void>(`${this.baseUrl}/${id}`, dto)
	}

	async getMyOrderById(id: string, token?: string): Promise<Orders | null> {
		const headers = token ? { Cookie: `${Tokens.ACCESS}=${token};` } : undefined

		try {
			return await fetchWrapper.get<Orders>(`${this.baseUrl}/my/${id}`, {
				headers
			})
		} catch {
			return null
		}
	}

	async getOrderById(id: string, token?: string): Promise<Orders | null> {
		const headers = token ? { Cookie: `${Tokens.ACCESS}=${token};` } : undefined

		try {
			return await fetchWrapper.get<Orders>(`${this.baseUrl}/${id}`, {
				headers
			})
		} catch {
			return null
		}
	}

	async getMyOrders(dto: GetOrdersDto): Promise<Paginated<Orders>> {
		const { token, query } = dto
		const headers = token ? { Cookie: `${Tokens.ACCESS}=${token};` } : undefined
		const params = getPaginationMeta(query)

		return fetchWrapper.get<Paginated<Orders>>(`${this.baseUrl}/my-orders`, {
			headers,
			params
		})
	}

	async getAllOrders(dto: GetOrdersDto): Promise<Paginated<Orders>> {
		const { token, query } = dto
		const headers = token ? { Cookie: `${Tokens.ACCESS}=${token};` } : undefined
		const params = getPaginationMeta(query)

		return fetchWrapper.get<Paginated<Orders>>(this.baseUrl, {
			headers,
			params
		})
	}
}

export const ordersService = new OrdersService()
