import { Controller, Get, ParseEnumPipe, Query } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Roles } from '../auth/roles/roles.decorator'
import { PeriodType } from './analytics.dto'
import { AnalyticsService } from './analytics.service'

@Controller('analytics')
export class AnalyticsController {
	constructor(private readonly analyticsService: AnalyticsService) {}

	@Get('average-daily-sales')
	@Roles(Role.ADMIN)
	async getAverageDailySalesForCurrentMonth() {
		return this.analyticsService.getAverageDailySalesForCurrentMonth()
	}

	@Get('total-orders')
	@Roles(Role.ADMIN)
	async getTotalOrdersForCurrentMonth() {
		return this.analyticsService.getTotalOrdersForCurrentMonth()
	}

	@Get('total-sales')
	@Roles(Role.ADMIN)
	async getTotalSalesForCurrentMonth() {
		return this.analyticsService.getTotalSalesForCurrentMonth()
	}

	@Get('statistics')
	@Roles(Role.ADMIN)
	async getPlatformStatistics() {
		return this.analyticsService.getPlatformStatistics()
	}

	@Get('sales-by-period')
	@Roles(Role.ADMIN)
	async getSalesByPeriodType(
		@Query('periodType', new ParseEnumPipe(PeriodType)) periodType: PeriodType,
	) {
		return this.analyticsService.getSalesByPeriodType(periodType)
	}

	@Get('registered-by-month')
	@Roles(Role.ADMIN)
	async getRegisteredUsersByMonth() {
		return this.analyticsService.getRegisteredUsersByMonth()
	}

	@Get('created-by-month')
	@Roles(Role.ADMIN)
	async getCreatedOrdersByMonth() {
		return this.analyticsService.getCreatedOrdersByMonth()
	}

	@Get('completed-by-month')
	@Roles(Role.ADMIN)
	async getCompletedOrdersByMonth() {
		return this.analyticsService.getCompletedOrdersByMonth()
	}
}
