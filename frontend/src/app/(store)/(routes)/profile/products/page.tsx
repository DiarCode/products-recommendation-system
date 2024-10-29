import { cookies } from 'next/headers'

import { Metadata } from 'next'

import { ProductsList } from '@/modules/products/components/products-list'
import { productsService } from '@/modules/products/services/products.service'

export const metadata: Metadata = {
	title: 'Купленные товары'
}

export default async function ProfileHistoryProductsPage() {
	const myHistoryProducts = await productsService.getMyHistoryProducts({
		headers: { Cookie: cookies().toString() }
	})

	return (
		<ProductsList
			products={myHistoryProducts}
			disableCart
			disableFavorite
		/>
	)
}
