import { Injectable } from '@nestjs/common'
import { OrderStatus } from '@prisma/client'
import { endOfMonth, startOfMonth } from 'date-fns'
import * as moment from 'moment'
import { PrismaService } from '../../database/prisma.service'
import { ACTIVE_ORDER_STATUSES } from '../order/order.dto'
import {
	AverageDailySalesDto,
	LabelValue,
	PeriodType,
	PlatformStatisticsDto,
} from './analytics.dto'

@Injectable()
export class AnalyticsService {
	constructor(private readonly prisma: PrismaService) {}

	async getAverageDailySalesForCurrentMonth(): Promise<AverageDailySalesDto> {
		const now = new Date()

		const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
		const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
		const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)
		const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

		const daysInCurrentMonth = endOfCurrentMonth.getDate()
		const daysInPreviousMonth = endOfPreviousMonth.getDate()

		const currentMonthSales = await this.prisma.order.aggregate({
			_sum: {
				totalPrice: true,
			},
			where: {
				status: OrderStatus.DELIVERED,
				createdAt: {
					gte: startOfCurrentMonth,
					lte: endOfCurrentMonth,
				},
			},
		})

		const previousMonthSales = await this.prisma.order.aggregate({
			_sum: {
				totalPrice: true,
			},
			where: {
				status: OrderStatus.DELIVERED,
				createdAt: {
					gte: startOfPreviousMonth,
					lte: endOfPreviousMonth,
				},
			},
		})

		const averageDailySalesCurrentMonth =
			(currentMonthSales._sum.totalPrice || 0) / daysInCurrentMonth
		const averageDailySalesPreviousMonth =
			(previousMonthSales._sum.totalPrice || 0) / daysInPreviousMonth

		const changeRate = this.calculateChangeRate(
			averageDailySalesCurrentMonth,
			averageDailySalesPreviousMonth,
		)

		const currentSales = currentMonthSales._sum.totalPrice || 0
		const previousSales = previousMonthSales._sum.totalPrice || 0

		return {
			value: averageDailySalesCurrentMonth,
			changeRate,
			currentSales,
			previousSales,
		}
	}

	private calculateChangeRate(current: number, previous: number): number {
		if (previous === 0) {
			return current > 0 ? 100 : 0
		}
		return ((current - previous) / previous) * 100
	}

	async getTotalOrdersForCurrentMonth(): Promise<{ value: number; changeRate: number }> {
		const now = new Date()

		const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
		const endOfCurrentMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
		const startOfPreviousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
		const endOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999)

		const currentMonthOrders = await this.prisma.order.count({
			where: {
				createdAt: {
					gte: startOfCurrentMonth,
					lte: endOfCurrentMonth,
				},
			},
		})

		const previousMonthOrders = await this.prisma.order.count({
			where: {
				createdAt: {
					gte: startOfPreviousMonth,
					lte: endOfPreviousMonth,
				},
			},
		})

		const changeRate = this.calculateChangeRate(currentMonthOrders, previousMonthOrders)

		return {
			value: currentMonthOrders,
			changeRate,
		}
	}

	async getTotalSalesForCurrentMonth(): Promise<{ value: number; changeRate: number }> {
		const { currentSales: currentSales, previousSales: previousSales } =
			await this.getAverageDailySalesForCurrentMonth()

		const changeRate = this.calculateChangeRate(currentSales, previousSales)

		return {
			value: currentSales,
			changeRate,
		}
	}

	async getPlatformStatistics(): Promise<PlatformStatisticsDto> {
		const now = new Date()
		const startOfCurrentMonth = startOfMonth(now)
		const endOfCurrentMonth = endOfMonth(now)

		try {
			const [
				customersCount,
				productsCount,
				completedOrdersCount,
				activeOrdersCount,
				newUsersCount,
			] = await Promise.all([
				// Количество всех пользователей
				this.prisma.user.count(),

				// Количество продуктов
				this.prisma.product.count(),

				// Количество завершенных заказов
				this.prisma.order.count({
					where: {
						status: OrderStatus.DELIVERED,
					},
				}),

				// Количество активных заказов
				this.prisma.order.count({
					where: {
						status: {
							in: ACTIVE_ORDER_STATUSES,
						},
					},
				}),

				// Количество новых пользователей за текущий месяц
				this.prisma.user.count({
					where: {
						createdAt: {
							gte: startOfCurrentMonth,
							lte: endOfCurrentMonth,
						},
					},
				}),
			])

			const uniqueUsers = await this.prisma.order.findMany({
				where: {
					createdAt: {
						gte: startOfCurrentMonth,
						lte: endOfCurrentMonth,
					},
					status: OrderStatus.DELIVERED,
				},
				distinct: ['userId'],
				select: {
					userId: true,
				},
			})

			const monthlyActiveUsers = uniqueUsers.length

			return {
				customersCount,
				productsCount,
				completedOrdersCount,
				activeOrdersCount,
				monthlyActiveUsers,
				registeredUsersForCurrentMonth: newUsersCount,
			}
		} catch {
			throw new Error('Unable to fetch platform statistics')
		}
	}

	async getSalesByPeriodType(periodType: PeriodType): Promise<LabelValue[]> {
		let labels: LabelValue[] = []
		let dateFrom: Date
		const dateTo: Date = moment().endOf('day').toDate()
		let timeUnit: 'hour' | 'day' | 'month' | 'year'

		switch (periodType) {
			case PeriodType.ONE_DAY:
				dateFrom = moment().startOf('day').toDate()
				labels = Array.from({ length: 24 }, (_, i) => ({
					label: i.toString(),
					value: 0,
				}))
				timeUnit = 'hour'
				break

			case PeriodType.FIVE_DAYS:
				dateFrom = moment().subtract(4, 'days').startOf('day').toDate()
				labels = Array.from({ length: 5 }, (_, i) => ({
					label: moment()
						.subtract(4 - i, 'days')
						.format('YYYY-MM-DD'),
					value: 0,
				}))
				timeUnit = 'day'
				break

			case 'ONE_MONTH':
				dateFrom = moment().startOf('month').toDate()
				const daysInMonth = moment().daysInMonth()
				labels = Array.from({ length: daysInMonth }, (_, i) => ({
					label: moment().startOf('month').add(i, 'days').format('YYYY-MM-DD'),
					value: 0,
				}))
				timeUnit = 'day'
				break

			case PeriodType.SIX_MONTHS:
				dateFrom = moment().subtract(5, 'months').startOf('month').toDate()
				labels = Array.from({ length: 6 }, (_, i) => ({
					label: moment()
						.subtract(5 - i, 'months')
						.format('YYYY-MM'),
					value: 0,
				}))
				timeUnit = 'month'
				break

			case PeriodType.MAX:
				dateFrom = new Date('1970-01-01') // Начало отсчета
				labels = []
				timeUnit = 'year'
				break

			default:
				throw new Error('Invalid period type')
		}

		const orders = await this.prisma.order.findMany({
			where: {
				status: OrderStatus.DELIVERED,
				createdAt: {
					gte: dateFrom,
					lte: dateTo,
				},
			},
			select: {
				totalPrice: true,
				createdAt: true,
			},
		})

		const salesMap = new Map<string, number>()

		for (const order of orders) {
			let key: string

			switch (timeUnit) {
				case 'hour':
					key = moment(order.createdAt).format('H')
					break
				case 'day':
					key = moment(order.createdAt).format('YYYY-MM-DD')
					break
				case 'month':
					key = moment(order.createdAt).format('YYYY-MM')
					break
				case 'year':
					key = moment(order.createdAt).format('YYYY')
					break
				default:
					key = ''
					break
			}

			const currentValue = salesMap.get(key) || 0
			salesMap.set(key, currentValue + order.totalPrice)
		}

		// Обновляем метки данными из salesMap
		if (periodType === PeriodType.MAX) {
			labels = Array.from(salesMap.keys())
				.sort()
				.map(key => ({
					label: moment(key, 'YYYY').toISOString(),
					value: salesMap.get(key) || 0,
				}))
		} else {
			labels = labels.map(item => ({
				label:
					periodType === PeriodType.ONE_DAY
						? moment().startOf('day').add(parseInt(item.label), 'hours').toISOString()
						: moment(item.label).toISOString(),
				value: salesMap.get(item.label) || 0,
			}))
		}

		return labels
	}

	async getRegisteredUsersByMonth(): Promise<LabelValue[]> {
		const currentYear = moment().year()

		const users = await this.prisma.user.findMany({
			where: {
				createdAt: {
					gte: new Date(`${currentYear}-01-01T00:00:00Z`),
					lte: new Date(`${currentYear}-12-31T23:59:59Z`),
				},
			},
			select: {
				createdAt: true,
			},
		})

		const months = moment.months()
		const result = months.map(month => ({
			label: month,
			value: 0,
		}))

		users.forEach(user => {
			const monthIndex = moment(user.createdAt).month()
			result[monthIndex].value += 1
		})

		const currentMonthIndex = moment().month()
		return result.slice(0, currentMonthIndex + 1)
	}

	async getCreatedOrdersByMonth(): Promise<LabelValue[]> {
		const currentYear = moment().year()

		const orders = await this.prisma.order.findMany({
			where: {
				createdAt: {
					gte: new Date(`${currentYear}-01-01T00:00:00Z`),
					lte: new Date(`${currentYear}-12-31T23:59:59Z`),
				},
			},
			select: {
				createdAt: true,
			},
		})

		const months = moment.months()
		const result = months.map(month => ({
			label: month,
			value: 0,
		}))

		orders.forEach(order => {
			const monthIndex = moment(order.createdAt).month()
			result[monthIndex].value += 1
		})

		const currentMonthIndex = moment().month()
		return result.slice(0, currentMonthIndex + 1)
	}

	async getCompletedOrdersByMonth(): Promise<LabelValue[]> {
		const currentYear = moment().year()

		const orders = await this.prisma.order.findMany({
			where: {
				createdAt: {
					gte: new Date(`${currentYear}-01-01T00:00:00Z`),
					lte: new Date(`${currentYear}-12-31T23:59:59Z`),
				},
				status: {
					in: [OrderStatus.DELIVERED],
				},
			},
			select: {
				createdAt: true,
			},
		})

		const months = moment.months()
		const result = months.map(month => ({
			label: month,
			value: 0,
		}))

		orders.forEach(order => {
			const monthIndex = moment(order.createdAt).month()
			result[monthIndex].value += 1
		})

		const currentMonthIndex = moment().month()
		return result.slice(0, currentMonthIndex + 1)
	}
}
