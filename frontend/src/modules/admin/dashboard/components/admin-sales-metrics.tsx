'use client'

import { Suspense } from 'react'

import { useAnalyticsAverageSales } from '../hooks/use-avg-sales.hook'
import { useAnalyticsTotalOrders } from '../hooks/use-total-orders.hook'
import { useAnalyticsTotalSales } from '../hooks/use-total-sales.hook'

import { AdminAnalyticsCard, AdminSalesCardSkeleton } from './admin-sales-card'
import { AdminSalesLineChart } from './admin-sales-linechart'
import { formatPrice } from '@/core/lib/price.utils'

export const AdminSalesMetrics = () => {
	const { data: totalSales } = useAnalyticsTotalSales()
	const { data: avgSales } = useAnalyticsAverageSales()
	const { data: totalOrders } = useAnalyticsTotalOrders()

	return (
		<div className='grid auto-rows-fr grid-cols-3 gap-5'>
			<div className='col-span-full flex flex-col gap-4 md:col-span-1'>
				<Suspense fallback={<AdminSalesCardSkeleton />}>
					<AdminAnalyticsCard
						title='Продажи за текущий месяц'
						value={formatPrice(totalSales.value)}
						changePercentage={totalSales.changeRate}
						changeRateDescription='По сравнению с предыдущим месяцем'
					/>
				</Suspense>

				<Suspense fallback={<AdminSalesCardSkeleton />}>
					<AdminAnalyticsCard
						title='Среднедневные продажи за текущий месяц'
						value={formatPrice(avgSales.value)}
						changePercentage={avgSales.changeRate}
						changeRateDescription='По сравнению с предыдущим месяцем'
					/>
				</Suspense>

				<Suspense fallback={<AdminSalesCardSkeleton />}>
					<AdminAnalyticsCard
						title='Количество заказов за текущий месяц'
						value={formatPrice(totalOrders.value)}
						changePercentage={totalOrders.changeRate}
						changeRateDescription='По сравнению с предыдущим месяцем'
					/>
				</Suspense>
			</div>

			<div className='col-span-full md:col-span-2'>
				<AdminSalesLineChart />
			</div>
		</div>
	)
}
