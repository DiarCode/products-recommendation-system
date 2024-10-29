import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { File } from 'lucide-react'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { Button } from '@/core/components/ui/button'
import { Card, CardContent } from '@/core/components/ui/card'
import { getPage } from '@/core/config/pages.config'
import { NO_INDEX_PAGE } from '@/core/constants/seo.constants'
import { PaginateQuery } from '@/core/models/paginate.types'
import { AdminCategoriesList } from '@/modules/admin/categories/components/admin-categories-list'
import { CreateCategoryContainer } from '@/modules/admin/categories/components/create-category/create-category-container'
import { ADMIN_CATEGORIES_QUERY_KEY } from '@/modules/admin/categories/hooks/use-admin-categories.hook'
import { AdminSearchInput } from '@/modules/admin/components/admin-search-input'
import { categoriesService } from '@/modules/categories/services/categories.service'

export const metadata: Metadata = {
	title: getPage('ADMIN_CATEGORIES').label,
	...NO_INDEX_PAGE
}

interface AdminCategoriesPageProps {
	searchParams: AdminCategoriesPageSearchParams
}

interface AdminCategoriesPageSearchParams {
	search?: string
}

export default async function AdminCategoriesPage({
	searchParams
}: AdminCategoriesPageProps) {
	const queryClient = getQueryClient()

	const query: PaginateQuery = {
		search: searchParams.search
	}

	await queryClient.prefetchQuery({
		queryKey: [ADMIN_CATEGORIES_QUERY_KEY, query],
		queryFn: () => categoriesService.getCategoriesPageable(query)
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

					<CreateCategoryContainer />
				</div>
			</div>

			<Card className='mt-4 shadow-none'>
				<CardContent className='p-5'>
					<AdminCategoriesList query={query} />
				</CardContent>
			</Card>
		</HydrationBoundary>
	)
}
