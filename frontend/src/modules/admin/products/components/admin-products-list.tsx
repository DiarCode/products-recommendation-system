'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Suspense, useState } from 'react'

import { Badge } from '@/core/components/ui/badge'
import { Button } from '@/core/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { DEFAULT_LIMIT } from '@/core/lib/pagintation.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { PaginateQuery } from '@/core/models/paginate.types'
import { useProducts } from '@/modules/products/hooks/use-products'
import { FORMATTED_PRODUCTS_STATUS } from '@/modules/products/models/products.types'

interface AdminProductsListProps {
	query?: PaginateQuery
}

export const AdminProductsList = ({ query }: AdminProductsListProps) => {
	const [limit, setLimit] = useState(DEFAULT_LIMIT)

	const router = useRouter()
	const { data: products } = useProducts({ query: { ...query, limit } })

	const handleLoadMore = () => {
		const leftItemsCount = products.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{products.data.length === 0 && (
				<p className='text-muted-foreground'>Товары не найдены</p>
			)}
			{products.data.length > 0 && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='hidden w-[100px] sm:table-cell'>
								<span className='sr-only'>Картина</span>
							</TableHead>
							<TableHead>Название</TableHead>
							<TableHead>Статус</TableHead>
							<TableHead className='hidden md:table-cell'>
								Подкатегория
							</TableHead>
							<TableHead className='hidden md:table-cell'>Кол-во</TableHead>
							<TableHead className='hidden md:table-cell'>Цена</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.data.map(product => (
							<TableRow
								key={product.id}
								className='cursor-pointer'
								onClick={() => router.push(`/admin/products/${product.id}`)}
							>
								<TableCell className='hidden sm:table-cell'>
									<Image
										alt={product.name}
										className='aspect-square rounded-md bg-muted object-contain'
										height='64'
										src={getProductImageUrl(product.images[0])}
										loading='lazy'
										width='64'
									/>
								</TableCell>
								<TableCell className='font-medium'>{product.name}</TableCell>
								<TableCell>
									<Badge variant='outline'>
										{FORMATTED_PRODUCTS_STATUS[product.status]}
									</Badge>
								</TableCell>
								<TableCell className='hidden md:table-cell'>
									{product.subCategory.name}
								</TableCell>
								<TableCell className='hidden md:table-cell'>
									{product.stock}
								</TableCell>
								<TableCell className='hidden md:table-cell'>
									{formatPrice(product.price)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

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
		</Suspense>
	)
}
