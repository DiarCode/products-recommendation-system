import { useSuspenseQuery } from '@tanstack/react-query'

import { productsService } from '../services/products.service'

import { PaginateQuery } from '@/core/models/paginate.types'

export const PRODUCTS_QUERY_KEY = 'products:all'
export const PRODUCT_DETAILS_QUERY_KEY = 'products:details'

interface UseProductsProps {
	query?: PaginateQuery
}

export const useProducts = ({ query }: UseProductsProps) => {
	return useSuspenseQuery({
		queryKey: [PRODUCTS_QUERY_KEY, query],
		queryFn: () => productsService.getPageableProducts(query)
	})
}

export const useProduct = (id: string) => {
	return useSuspenseQuery({
		queryKey: [PRODUCT_DETAILS_QUERY_KEY, id],
		queryFn: () => productsService.getProductById(id)
	})
}
