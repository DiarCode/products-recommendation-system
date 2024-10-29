'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

import { Suspense, useState } from 'react'

import { useAdminCategories } from '../hooks/use-admin-categories.hook'

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

interface AdminCategoriesListProps {
	query?: PaginateQuery
}

export const AdminCategoriesList = ({ query }: AdminCategoriesListProps) => {
	const [limit, setLimit] = useState(DEFAULT_LIMIT)

	const router = useRouter()
	const { data: categories } = useAdminCategories({ ...query, limit })

	const handleLoadMore = () => {
		const leftItemsCount = categories.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{categories.data.length === 0 && (
				<p className='text-muted-foreground'>Категория не найдена</p>
			)}
			{categories.data.length > 0 && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='hidden w-[100px] sm:table-cell'>
								<span className='sr-only'>Изображение</span>
							</TableHead>
							<TableHead>Название</TableHead>
							<TableHead>Подкатегорий</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories.data.map(category => (
							<TableRow
								key={category.id}
								className='cursor-pointer'
								onClick={() => router.push(`/admin/categories/${category.id}`)}
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
								<TableCell>{category.subCategories.length}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{categories.meta.totalItems - limit > 0 && (
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
