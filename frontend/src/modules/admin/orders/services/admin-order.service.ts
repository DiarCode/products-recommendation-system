import { CreateAdminOrderDto } from '../models/admin-order.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'

class AdminOrdersService {
	private readonly baseUrl = `/api/v1/order/admin`

	async createOrder(dto: CreateAdminOrderDto) {
		return fetchWrapper.post<void>(this.baseUrl, dto)
	}
}

export const adminOrdersService = new AdminOrdersService()
