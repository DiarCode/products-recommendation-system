import { Metadata } from 'next'

import { NO_INDEX_PAGE } from '@/core/constants/seo.constants'
import { CreateAdminOrders } from '@/modules/admin/orders/components/admin-create-order'

export const metadata: Metadata = {
	title: 'Создать заказ',
	...NO_INDEX_PAGE
}

export default async function AdminCreateOrderPage() {
	return (
		<div>
			<CreateAdminOrders />
		</div>
	)
}
