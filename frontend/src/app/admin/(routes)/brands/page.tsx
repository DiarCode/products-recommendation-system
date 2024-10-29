import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { File } from 'lucide-react'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { Button } from '@/core/components/ui/button'
import { Card, CardContent } from '@/core/components/ui/card'
import { getPage } from '@/core/config/pages.config'
import { NO_INDEX_PAGE } from '@/core/constants/seo.constants'
import { PaginateQuery } from '@/core/models/paginate.types'
import { AdminBrandsList } from '@/modules/admin/brands/components/admin-brands-list'
import { CreateBrandContainer } from '@/modules/admin/brands/components/create-brand/create-brand-container'
import { ADMIN_BRANDS_QUERY_KEY } from '@/modules/admin/brands/hooks/use-admin-brands.hook'
import { AdminSearchInput } from '@/modules/admin/components/admin-search-input'
import { brandService } from '@/modules/brands/services/brands.service'

export const metadata: Metadata = {
	title: getPage('ADMIN_BRANDS').label,
	...NO_INDEX_PAGE
}

interface AdminBrandsPageProps {
	searchParams: AdminBrandsPageSearchParams
}

interface AdminBrandsPageSearchParams {
	search?: string
}

export default async function AdminBrandsPage({
	searchParams
}: AdminBrandsPageProps) {
	const queryClient = getQueryClient()

	const query: PaginateQuery = {
		search: searchParams.search
	}

	await queryClient.prefetchQuery({
		queryKey: [ADMIN_BRANDS_QUERY_KEY, query],
		queryFn: () => brandService.getPageable(query)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='flex items-center gap-4'>
				<AdminSearchInput search={searchParams.search} />

				<div className='ml-auto flex items-center gap-2'>
					<Button
						variant='outline'
						className='gap-2'
					>
						<File className='h-4 w-4' />
						<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
							Экспорт
						</span>
					</Button>

					<CreateBrandContainer />
				</div>
			</div>

			<Card className='mt-4 shadow-none'>
				<CardContent className='p-5'>
					<AdminBrandsList query={query} />
				</CardContent>
			</Card>
		</HydrationBoundary>
	)
}
