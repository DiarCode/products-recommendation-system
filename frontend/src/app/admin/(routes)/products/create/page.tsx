import { Metadata } from 'next'

import { ProductsDetails } from '@/modules/admin/products/components/admin-products-details'

export const metadata: Metadata = {
	title: 'Создать товар'
}

export default async function AdminCreateProductPage() {
	return <ProductsDetails type='CREATE' />
}
