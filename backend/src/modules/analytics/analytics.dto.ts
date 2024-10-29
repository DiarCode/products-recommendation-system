export class PlatformStatisticsDto {
	customersCount: number
	productsCount: number
	completedOrdersCount: number
	activeOrdersCount: number
	monthlyActiveUsers: number
	registeredUsersForCurrentMonth: number
}

export class AverageDailySalesDto {
	value: number
	changeRate: number
	currentSales: number
	previousSales: number
}

export enum PeriodType {
	ONE_DAY = 'ONE_DAY',
	FIVE_DAYS = 'FIVE_DAYS',
	ONE_MONTH = 'ONE_MONTH',
	SIX_MONTHS = 'SIX_MONTHS',
	MAX = 'MAX',
}

export interface LabelValue {
	label: string
	value: number
}
