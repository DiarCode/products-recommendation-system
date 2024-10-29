'use client'

import { File } from 'lucide-react'
import { Suspense } from 'react'

import { AdminSearchInput } from '../../components/admin-search-input'
import { useAdminCategory } from '../hooks/use-admin-categories.hook'

import { AdminSubCategoriesList } from './admin-subcategories-list'
import { CreateSubCategoryContainer } from './create-subcategory/create-subcategory-container'
import { DeleteCategoryContainer } from './delete-category/delete-category-container'
import { UpdateCategoryContainer } from './update-category/update-category-container'
import { Button } from '@/core/components/ui/button'
import { Card, CardContent } from '@/core/components/ui/card'
import { PaginateQuery } from '@/core/models/paginate.types'

interface AdminCategoryDetailsContainerProps {
	categoryId: string
	query: PaginateQuery
}

export const AdminCategoryDetailsContainer = ({
	categoryId,
	query
}: AdminCategoryDetailsContainerProps) => {
	const { data: category } = useAdminCategory(categoryId)

	return (
		<Suspense fallback='Загрузка...'>
			{category ? (
				<div>
					<div className='flex items-center gap-3'>
						<h1 className='text-xl font-medium'>{category.name}</h1>

						<UpdateCategoryContainer category={category} />
						<DeleteCategoryContainer category={category} />
					</div>

					<div className='mt-6 flex items-center gap-4'>
						<AdminSearchInput search={query.search} />

						<div className='ml-auto flex items-center gap-2'>
							<Button
								variant='outline'
								className='gap-2'
							>
								<File className='h-4 w-4' />
								<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
									Экспорт
								</span>
							</Button>

							<CreateSubCategoryContainer categoryId={categoryId} />
						</div>
					</div>

					<Card className='mt-4 shadow-none'>
						<CardContent className='p-4'>
							<AdminSubCategoriesList query={query} />
						</CardContent>
					</Card>
				</div>
			) : (
				<div className='mt-12 flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-2xl font-bold'>
							Категория не найдена
						</h1>
						<h2 className='mt-4 text-center'>
							Пожалуйста, проверьте правильность пути или выберите другую
							категорию из списка.
						</h2>
					</div>
				</div>
			)}
		</Suspense>
	)
}
