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
import { AdminProductsList } from '@/modules/admin/products/components/admin-products-list'
import { AdminProductsSearchFilter } from '@/modules/admin/products/components/filters/admin-products-filter'
import { PRODUCTS_QUERY_KEY } from '@/modules/products/hooks/use-products'
import { ProductsStatus } from '@/modules/products/models/products.types'
import { productsService } from '@/modules/products/services/products.service'

export const metadata: Metadata = {
	title: getPage('ADMIN_PRODUCTS').label,
	...NO_INDEX_PAGE
}

interface AdminProductsPageProps {
	searchParams: AdminProductsPageSearchParams
}

interface AdminProductsPageSearchParams {
	status?: ProductsStatus
	search?: string
	subCategoryId?: string
	brandCategoryId?: string
}

export default async function AdminProductsPage({
	searchParams
}: AdminProductsPageProps) {
	const queryClient = getQueryClient()

	const query: PaginateQuery = {
		filter: {
			status: searchParams.status,
			subCategoryId: searchParams.subCategoryId,
			brandCategoryId: searchParams.brandCategoryId
		},
		search: searchParams.search
	}

	await queryClient.prefetchQuery({
		queryKey: [PRODUCTS_QUERY_KEY, query],
		queryFn: () => productsService.getPageableProducts(query)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='flex items-center gap-4'>
				<AdminSearchInput search={searchParams.search} />

				<div className='ml-auto flex items-center gap-2'>
					<AdminProductsSearchFilter filter={query.filter}>
						<Button
							variant='outline'
							className='gap-2'
						>
							<Filter className='h-4 w-4' />
							<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
								Фильтр
							</span>
						</Button>
					</AdminProductsSearchFilter>

					<Button
						variant='outline'
						className='gap-2'
					>
						<File className='h-4 w-4' />
						<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
							Экспорт
						</span>
					</Button>

					<Link href='/admin/products/create'>
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
					<AdminProductsList query={query} />
				</CardContent>
			</Card>
		</HydrationBoundary>
	)
}
