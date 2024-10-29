import { cookies } from 'next/headers'
import Link from 'next/link'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { File, Filter, Plus } from 'lucide-react'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { Button } from '@/core/components/ui/button'
import { Card, CardContent } from '@/core/components/ui/card'
import { getPage } from '@/core/config/pages.config'
import { NO_INDEX_PAGE } from '@/core/constants/seo.constants'
import { PaginateQuery } from '@/core/models/paginate.types'
import { AdminSearchInput } from '@/modules/admin/components/admin-search-input'
import { AdminOrdersFilter } from '@/modules/admin/orders/components/admin-orders-filter'
import { AdminOrdersList } from '@/modules/admin/orders/components/admin-orders-list'
import { ADMIN_ORDERS_QUERY_KEY } from '@/modules/admin/orders/hooks/use-admin-orders.hook'
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { ordersService } from '@/modules/orders/services/orders.service'

export const metadata: Metadata = {
	title: getPage('ADMIN_ORDERS').label,
	...NO_INDEX_PAGE
}

interface AdminOrdersPageProps {
	searchParams: AdminOrdersPageSearchParams
}

interface AdminOrdersPageSearchParams {
	status?: string
	search?: string
	isPaid?: string
}

export default async function AdminOrdersPage({
	searchParams
}: AdminOrdersPageProps) {
	const queryClient = getQueryClient()
	const token = cookies().get(Tokens.ACCESS)?.value

	const query: PaginateQuery = {
		filter: {
			status: searchParams.status,
			isPaid: searchParams.isPaid
		},
		search: searchParams.search
	}

	await queryClient.prefetchQuery({
		queryKey: [ADMIN_ORDERS_QUERY_KEY, query],
		queryFn: () => ordersService.getAllOrders({ query, token })
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='flex items-center gap-4'>
				<AdminSearchInput search={searchParams.search} />

				<div className='ml-auto flex items-center gap-2'>
					<AdminOrdersFilter filter={query.filter}>
						<Button
							variant='outline'
							className='gap-2'
						>
							<Filter className='h-4 w-4' />
							<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
								Фильтр
							</span>
						</Button>
					</AdminOrdersFilter>

					<Button
						variant='outline'
						className='gap-2'
					>
						<File className='h-4 w-4' />
						<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
							Экспорт
						</span>
					</Button>

					<Link href='/admin/orders/create'>
						<Button className='gap-2'>
							<Plus className='h-4 w-4' />
							<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
								Добавить
							</span>
						</Button>
					</Link>
				</div>
			</div>

			<Card className='mt-4 shadow-none'>
				<CardContent className='p-5'>
					<AdminOrdersList query={query} />
				</CardContent>
			</Card>
		</HydrationBoundary>
	)
}
