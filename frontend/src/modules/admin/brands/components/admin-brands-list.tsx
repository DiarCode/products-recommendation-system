'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Suspense, useState } from 'react'

import { useAdminBrands } from '../hooks/use-admin-brands.hook'

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
import { PaginateQuery } from '@/core/models/paginate.types'

interface AdminBrandsListProps {
	query?: PaginateQuery
}

export const AdminBrandsList = ({ query }: AdminBrandsListProps) => {
	const [limit, setLimit] = useState(DEFAULT_LIMIT)

	const router = useRouter()
	const { data: brands } = useAdminBrands({ ...query, limit })

	const handleLoadMore = () => {
		const leftItemsCount = brands.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{brands.data.length === 0 && (
				<p className='text-muted-foreground'>Бренды не найдены</p>
			)}
			{brands.data.length > 0 && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='hidden w-[100px] sm:table-cell'>
								<span className='sr-only'>Изображение</span>
							</TableHead>
							<TableHead>Название</TableHead>
							<TableHead>Категорий</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{brands.data.map(category => (
							<TableRow
								key={category.id}
								className='cursor-pointer'
								onClick={() => router.push(`/admin/brands/${category.id}`)}
							>
								<TableCell className='hidden sm:table-cell'>
									<Image
										alt={category.name}
										className='aspect-square rounded-md bg-muted object-contain'
										height='64'
										src={getProductImageUrl(undefined)}
										loading='lazy'
										width='64'
									/>
								</TableCell>
								<TableCell className='font-medium'>{category.name}</TableCell>
								<TableCell>{category.brandCategories.length}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{brands.meta.totalItems - limit > 0 && (
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
