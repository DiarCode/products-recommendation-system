import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { PaginateQuery } from '@/core/models/paginate.types'
import { AdminBrandDetailsContainer } from '@/modules/admin/brands/components/admin-brand-details-container'
import { ADMIN_BRAND_DETAILS_QUERY_KEY } from '@/modules/admin/brands/hooks/use-admin-brands.hook'
import { brandService } from '@/modules/brands/services/brands.service'

export async function generateMetadata({
	params
}: AdminBrandsDetailsPageProps): Promise<Metadata> {
	const id = params.id

	const brand = await brandService.getById(id)

	return {
		title: brand ? `Детали ${brand.name}` : 'Детали бренда'
	}
}

interface AdminBrandsDetailsPageProps {
	params: { id: string }
	searchParams: AdminBrandDetailsPageSearchParams
}

interface AdminBrandDetailsPageSearchParams {
	search?: string
}

export default function AdminBrandDetailsPage({
	params,
	searchParams
}: AdminBrandsDetailsPageProps) {
	const queryClient = getQueryClient()

	const query: PaginateQuery = {
		search: searchParams.search,
		filter: {
			brandId: params.id
		}
	}

	queryClient.prefetchQuery({
		queryKey: [ADMIN_BRAND_DETAILS_QUERY_KEY, params.id],
		queryFn: () => brandService.getById(params.id)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AdminBrandDetailsContainer
				query={query}
				brandId={params.id}
			/>
		</HydrationBoundary>
	)
}
