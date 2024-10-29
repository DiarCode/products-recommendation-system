import { Metadata } from 'next'

import { getPage } from '@/core/config/pages.config'
import { NO_INDEX_PAGE } from '@/core/constants/seo.constants'
import { AdminSalesMetrics } from '@/modules/admin/dashboard/components/admin-sales-metrics'
import { AdminStoreStatistics } from '@/modules/admin/dashboard/components/admin-store-statistics'

export const metadata: Metadata = {
	title: getPage('ADMIN_DASHBOARD').label,
	...NO_INDEX_PAGE
}

export default async function AdminDashboardPage() {
	return (
		<div className='relative h-full w-full'>
			<AdminSalesMetrics />

			<div className='mt-5'>
				<AdminStoreStatistics />
			</div>
		</div>
	)
}
