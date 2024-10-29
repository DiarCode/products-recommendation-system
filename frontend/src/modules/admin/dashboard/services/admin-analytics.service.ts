import {
	GraphItem,
	StoresStatistics,
	ValueWithChangeRate
} from '../models/admin-analytics-dto.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'

class AdminAnalyticsService {
	private readonly baseUrl = `/api/v1/analytics`

	async getAverageDailySalesForCurrentMonth() {
		const response = await fetchWrapper.get<ValueWithChangeRate>(
			`${this.baseUrl}/average-daily-sales`
		)

		return response
	}

	async getSalesByPeriodType(periodType = '1day') {
		const response = await fetchWrapper.get<GraphItem[]>(
			`${this.baseUrl}/sales-by-period`,
			{ params: { periodType } }
		)

		return response
	}

	async getTotalOrdersForCurrentMonth() {
		const response = await fetchWrapper.get<ValueWithChangeRate>(
			`${this.baseUrl}/total-orders`
		)

		return response
	}

	async getTotalSalesForCurrentMonth() {
		const response = await fetchWrapper.get<ValueWithChangeRate>(
			`${this.baseUrl}/total-sales`
		)

		return response
	}

	async getStoresStatistics() {
		const response = await fetchWrapper.get<StoresStatistics>(
			`${this.baseUrl}/statistics`
		)

		return response
	}

	async getRegisteredUsersByMonth() {
		const response = await fetchWrapper.get<GraphItem[]>(
			`${this.baseUrl}/platform/registered-users-by-month`
		)

		return response
	}

	async getCreatedOrdersByMonth() {
		const response = await fetchWrapper.get<GraphItem[]>(
			`${this.baseUrl}/platform/created-orders-by-month`
		)

		return response
	}

	async getCompletedOrdersByMonth() {
		const response = await fetchWrapper.get<GraphItem[]>(
			`${this.baseUrl}/platform/completed-orders-by-month`
		)

		return response
	}
}

export const adminAnalyticsService = new AdminAnalyticsService()
