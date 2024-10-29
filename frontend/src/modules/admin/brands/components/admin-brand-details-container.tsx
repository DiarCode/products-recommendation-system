'use client'

import { File } from 'lucide-react'
import { Suspense } from 'react'

import { AdminSearchInput } from '../../components/admin-search-input'
import { useAdminBrand } from '../hooks/use-admin-brands.hook'

import { AdminBrandCategoriesList } from './admin-brand-categories-list'
import { CreateBrandCategoryContainer } from './create-brand-category/create-brand-category-container'
import { DeleteBrandContainer } from './delete-brand/delete-brand-container'
import { UpdateBrandContainer } from './update-brand/update-brand-container'
import { Button } from '@/core/components/ui/button'
import { Card, CardContent } from '@/core/components/ui/card'
import { PaginateQuery } from '@/core/models/paginate.types'

interface AdminBrandDetailsContainerProps {
	brandId: string
	query: PaginateQuery
}

export const AdminBrandDetailsContainer = ({
	brandId,
	query
}: AdminBrandDetailsContainerProps) => {
	const { data: brand } = useAdminBrand(brandId)

	return (
		<Suspense fallback='Загрузка...'>
			{brand ? (
				<div>
					<div className='flex items-center gap-3'>
						<h1 className='text-xl font-medium'>{brand.name}</h1>

						<UpdateBrandContainer brand={brand} />
						<DeleteBrandContainer brand={brand} />
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

							<CreateBrandCategoryContainer brandId={brandId} />
						</div>
					</div>

					<Card className='mt-4 shadow-none'>
						<CardContent className='p-4'>
							<AdminBrandCategoriesList query={query} />
						</CardContent>
					</Card>
				</div>
			) : (
				<div className='mt-12 flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-2xl font-bold'>Бренд не найден</h1>
						<h2 className='mt-4 text-center'>
							Пожалуйста, проверьте правильность пути или выберите другой бренд
							из списка.
						</h2>
					</div>
				</div>
			)}
		</Suspense>
	)
}
