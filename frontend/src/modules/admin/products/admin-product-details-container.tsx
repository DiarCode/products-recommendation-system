'use client'

import React, { Suspense } from 'react'

import { ProductsDetails } from './components/admin-products-details'
import { useProduct } from '@/modules/products/hooks/use-products'

interface AdminProductDetailsContainerProps {
	productId: string
}

export const AdminProductDetailsContainer = ({
	productId
}: AdminProductDetailsContainerProps) => {
	const { data: product } = useProduct(productId)

	return (
		<Suspense fallback='Загрузка...'>
			{!product && <p className='text-muted-foreground'>Товар не найден</p>}
			{product && (
				<ProductsDetails
					product={product}
					type='UPDATE'
				/>
			)}
		</Suspense>
	)
}
