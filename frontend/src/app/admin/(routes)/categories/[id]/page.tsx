import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { PaginateQuery } from '@/core/models/paginate.types'
import { AdminCategoryDetailsContainer } from '@/modules/admin/categories/components/admin-category-details-container'
import { ADMIN_CATEGORY_DETAILS_QUERY_KEY } from '@/modules/admin/categories/hooks/use-admin-categories.hook'
import { categoriesService } from '@/modules/categories/services/categories.service'

export async function generateMetadata({
	params
}: AdminCategoriesDetailsPageProps): Promise<Metadata> {
	const id = params.id

	const category = await categoriesService.getCategoryById(id)

	return {
		title: category ? `Детали ${category.name}` : 'Детали категории'
	}
}

interface AdminCategoriesDetailsPageProps {
	params: { id: string }
	searchParams: AdminCategoryDetailsPageSearchParams
}

interface AdminCategoryDetailsPageSearchParams {
	search?: string
}

export default function AdminCategoryDetailsPage({
	params,
	searchParams
}: AdminCategoriesDetailsPageProps) {
	const queryClient = getQueryClient()

	const query: PaginateQuery = {
		search: searchParams.search,
		filter: {
			categoryId: params.id
		}
	}

	queryClient.prefetchQuery({
		queryKey: [ADMIN_CATEGORY_DETAILS_QUERY_KEY, params.id],
		queryFn: () => categoriesService.getCategoryById(params.id)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminCategoryDetailsContainer
				query={query}
				categoryId={params.id}
			/>
		</HydrationBoundary>
	)
}
