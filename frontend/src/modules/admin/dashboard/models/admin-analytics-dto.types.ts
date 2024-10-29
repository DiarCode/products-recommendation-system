export interface ValueWithChangeRate {
	value: number
	changeRate: number
}

export interface GraphItem {
	label: string
	value: string
}

export interface StoresStatistics {
	customersCount: number
	productsCount: number
	completedOrdersCount: number
	activeOrdersCount: number
	monthlyActiveUsers: number
	registeredUsersForCurrentMonth: number
}

export enum SALES_PERIODS {
	ONE_DAY = 'ONE_DAY',
	FIVE_DAYS = 'FIVE_DAYS',
	ONE_MONTH = 'ONE_MONTH',
	SIX_MONTHS = 'SIX_MONTHS',
	MAX = 'MAX'
}

export const FORMATTED_SALES_PERIODS = [
	{
		label: '1 день',
		value: SALES_PERIODS.ONE_DAY
	},
	{
		label: '5 дней',
		value: SALES_PERIODS.FIVE_DAYS
	},
	{
		label: '1 месяц',
		value: SALES_PERIODS.ONE_MONTH
	},
	{
		label: '6 месяцев',
		value: SALES_PERIODS.SIX_MONTHS
	},
	{
		label: 'Макс.',
		value: SALES_PERIODS.MAX
	}
]
