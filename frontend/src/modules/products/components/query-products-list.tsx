'use client'

import { Suspense, useState } from 'react'

import { useProducts } from '../hooks/use-products'

import { ProductsList, ProductsSkeletonList } from './products-list'
import { Button } from '@/core/components/ui/button'
import { DEFAULT_LIMIT } from '@/core/lib/pagintation.utils'
import { cn } from '@/core/lib/tailwind.utils'
import { PaginateQuery } from '@/core/models/paginate.types'

interface QueryProductsListProps {
	className?: string
	label?: string
	query?: PaginateQuery
}

export const QueryProductsList = ({
	className,
	label,
	query
}: QueryProductsListProps) => {
	const [limit, setLimit] = useState(DEFAULT_LIMIT)

	const updatedQuery = {
		...query,
		limit
	}

	const { data: products } = useProducts({ query: updatedQuery })

	const handleLoadMore = () => {
		const leftItemsCount = products.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	return (
		<div className={cn(className)}>
			{label && <h2 className='text-xl font-medium'>{label}</h2>}
			<Suspense fallback={<ProductsSkeletonList />}>
				{products.data.length === 0 ? (
					<p className='text-muted-foreground'>Ничего не найдено</p>
				) : (
					<>
						<ProductsList
							products={products.data || []}
							className='mt-6'
						/>

						{products.meta.totalItems - limit > 0 && (
							<div className='mt-6 flex justify-center'>
								<Button
									variant='ghost'
									className='text-primary'
									onClick={handleLoadMore}
								>
									Еще
								</Button>
							</div>
						)}
					</>
				)}
			</Suspense>
		</div>
	)
}
