import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { PaginateQuery } from '@/core/models/paginate.types'
import { categoriesService } from '@/modules/categories/services/categories.service'
import { subCategoriesService } from '@/modules/categories/services/sub-category.service'
import { ProductsResetFilters } from '@/modules/products/components/products-search/products-reset-filter'
import { ProductsSearchFilter } from '@/modules/products/components/products-search/products-search-filters'
import { ProductsSearchSort } from '@/modules/products/components/products-search/products-search-sort'
import { QueryProductsList } from '@/modules/products/components/query-products-list'
import { PRODUCTS_QUERY_KEY } from '@/modules/products/hooks/use-products'
import { productsService } from '@/modules/products/services/products.service'

interface ProductsPageSearchParams {
	search: string
	sortBy: string
	categoryId: string
	subCategoryId: string
	brandCategoryId: string
}

interface ProductsPageProps {
	searchParams: ProductsPageSearchParams
}

export async function generateMetadata({
	searchParams
}: ProductsPageProps): Promise<Metadata> {
	const fetchedTitle = await getMetadataTitle(searchParams)
	return {
		title: toTitleCase(fetchedTitle)
	}
}

export default async function ProductsPage({
	searchParams
}: ProductsPageProps) {
	const queryClient = getQueryClient()

	const { search, subCategoryId, sortBy, brandCategoryId } = searchParams

	const title = await getMetadataTitle(searchParams)

	const query: PaginateQuery = {
		search,
		sortBy: sortBy,
		filter: { subCategoryId, brandCategoryId }
	}

	const products = await productsService.getPageableProducts(query)

	await queryClient.prefetchQuery({
		queryKey: [PRODUCTS_QUERY_KEY, query],
		queryFn: () => productsService.getPageableProducts(query),
		initialData: products
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2'>
				<h1 className='text-3xl font-bold capitalize'>{toTitleCase(title)}</h1>
				<p className='text-muted-foreground'>
					{products.meta.totalItems} товара
				</p>
			</div>

			<div className='mt-4 flex flex-wrap items-center gap-x-2 gap-y-2'>
				<ProductsSearchSort selectedSort={sortBy} />
				<ProductsSearchFilter filter={query.filter} />
				<ProductsResetFilters />
			</div>

			<div className='mt-6 md:mt-8'>
				<QueryProductsList query={query} />
			</div>
		</HydrationBoundary>
	)
}

async function getMetadataTitle(searchParams: ProductsPageSearchParams) {
	const { search, categoryId, subCategoryId } = searchParams

	if (subCategoryId) {
		try {
			const subCategory =
				await subCategoriesService.getSubCategoryById(subCategoryId)
			if (subCategory) {
				return subCategory.name
			}
		} catch (error) {
			console.error('Failed to fetch subCategory:', error)
		}
	}

	if (categoryId) {
		try {
			const category = await categoriesService.getCategoryById(categoryId)
			if (category) {
				return category.name
			}
		} catch (error) {
			console.error('Failed to fetch category:', error)
		}
	}

	if (search) {
		return search
	}

	return 'Поиск'
}

function toTitleCase(s: string) {
	return s
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
		.join(' ')
}
