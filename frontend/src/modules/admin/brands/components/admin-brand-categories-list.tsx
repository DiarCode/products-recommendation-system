'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

import {
	ADMIN_BRAND_CATEGORIES_QUERY_KEY,
	useAdminBrandCategories
} from '../hooks/use-admin-brand-categories.hook'

import { Button } from '@/core/components/ui/button'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { DEFAULT_LIMIT } from '@/core/lib/pagintation.utils'
import { PaginateQuery } from '@/core/models/paginate.types'
import { BrandCategory } from '@/modules/brands/models/brand-category.types'
import { brandCategoriesService } from '@/modules/brands/services/brand-category.service'

const UpdateBrandCategoryDialog = dynamic(() =>
	import('./update-brand-category/update-brand-category-dialog').then(
		m => m.UpdateBrandCategoryDialog
	)
)

interface AdminBrandCategoriesListProps {
	query?: PaginateQuery
}

export const AdminBrandCategoriesList = ({
	query
}: AdminBrandCategoriesListProps) => {
	const queryClient = useQueryClient()
	const [limit, setLimit] = useState(DEFAULT_LIMIT)
	const [selectedBrandCategory, setSelectedBrandCategory] =
		useState<BrandCategory | null>(null)
	const { isOpen: isUpdateDialogOpen, toggleDialog: toggleUpdateDialog } =
		useDialog()

	const { data: brandCategories } = useAdminBrandCategories({ ...query, limit })

	const handleLoadMore = () => {
		const leftItemsCount = brandCategories.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	const { mutate: deleteSubCategory } = useMutation({
		mutationFn: (id: string) => brandCategoriesService.deleteBrandCategory(id),
		onSuccess: () => {
			toast.success('Категория успешно удалена')
			queryClient.invalidateQueries({
				queryKey: [ADMIN_BRAND_CATEGORIES_QUERY_KEY]
			})
		},
		onError: () => {
			toast.error('Ошибка при удалении категории')
		}
	})

	const onUpdateClick = (brandCategory: BrandCategory) => {
		setSelectedBrandCategory(brandCategory)
		toggleUpdateDialog()
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{brandCategories.data.length === 0 && (
				<p className='text-muted-foreground'>Категории не найдены</p>
			)}
			{brandCategories.data.length > 0 && (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className='hidden w-[100px] sm:table-cell'>
								<span className='sr-only'>Изображение</span>
							</TableHead>
							<TableHead>Название</TableHead>
							<TableHead>
								<span className='sr-only'>Действия</span>
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{brandCategories.data.map(brandCategory => (
							<TableRow key={brandCategory.id}>
								<TableCell className='hidden sm:table-cell'>
									<Image
										alt={brandCategory.name}
										className='aspect-square rounded-md bg-muted object-contain'
										height='64'
										src={getProductImageUrl(undefined)}
										loading='lazy'
										width='64'
									/>
								</TableCell>
								<TableCell className='font-medium'>
									{brandCategory.name}
								</TableCell>
								<TableCell className='font-medium'>
									<div className='float-right flex items-center'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => onUpdateClick(brandCategory)}
										>
											<Pencil className='h-5 w-5' />
										</Button>

										<Button
											variant='ghost'
											size='icon'
											className='hover:text-destructive'
											onClick={() => deleteSubCategory(brandCategory.id)}
										>
											<Trash className='h-5 w-5' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}

			{brandCategories.meta.totalItems - limit > 0 && (
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

			{isUpdateDialogOpen && selectedBrandCategory && (
				<UpdateBrandCategoryDialog
					isOpen={isUpdateDialogOpen}
					toggleDialog={toggleUpdateDialog}
					brandCategory={selectedBrandCategory}
				/>
			)}
		</Suspense>
	)
}
