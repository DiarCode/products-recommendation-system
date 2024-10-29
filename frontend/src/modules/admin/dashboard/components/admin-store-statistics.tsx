'use client'

import {
	Activity,
	Boxes,
	CircleCheckBig,
	ContactRound,
	UserRoundCheck,
	Users
} from 'lucide-react'
import { Suspense, useMemo } from 'react'

import { useAnalyticsStoreStatistics } from '../hooks/use-store-statistics.hook'

import { AdminAnalyticsCard } from './admin-sales-card'
import { Skeleton } from '@/core/components/ui/skeleton'

const statistics = {
	ACTIVE_ORDERS: {
		title: 'Активные заказы',
		value: 0,
		icon: Activity
	},
	COMPLETED_ORDERS: {
		title: 'Завершенные заказы',
		value: 0,
		icon: CircleCheckBig
	},
	PRODUCTS: {
		title: 'Товары',
		value: 0,
		icon: Boxes
	},
	USERS: {
		title: 'Пользователи',
		value: 0,
		icon: Users
	},
	MONTHLY_ACTIVE_USERS: {
		title: 'Активные пользователи в этом месяце',
		value: 0,
		icon: UserRoundCheck
	},
	REGISTERED_USERS_THI_MONTH: {
		title: 'Новые регистрации в этом месяце',
		value: 0,
		icon: ContactRound
	}
}

export const AdminStoreStatistics = () => {
	const { data } = useAnalyticsStoreStatistics()

	const renderedStatistics = useMemo(() => {
		statistics.ACTIVE_ORDERS.value = data.activeOrdersCount
		statistics.COMPLETED_ORDERS.value = data.completedOrdersCount
		statistics.PRODUCTS.value = data.productsCount
		statistics.USERS.value = data.customersCount
		statistics.MONTHLY_ACTIVE_USERS.value = data.monthlyActiveUsers
		statistics.REGISTERED_USERS_THI_MONTH.value =
			data.registeredUsersForCurrentMonth

		return Object.values(statistics).map(item => (
			<AdminAnalyticsCard
				key={item.title}
				title={item.title}
				value={item.value.toLocaleString()}
				icon={item.icon}
			/>
		))
	}, [data])

	return (
		<Suspense fallback={<AdminStoreStatisticsSkeletons />}>
			<div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3'>
				{renderedStatistics}
			</div>
		</Suspense>
	)
}

const AdminStoreStatisticsSkeletons = () => {
	return (
		<div className='grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3'>
			{Array.from({ length: 6 }).map((_, idx) => (
				<Skeleton
					key={idx}
					className='h-32 rounded-2xl'
				/>
			))}
		</div>
	)
}
