'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

import {
	ADMIN_SUBCATEGORIES_QUERY_KEY,
	useAdminSubCategories
} from '../hooks/use-admin-subcategories.hook'

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
import { SubCategory } from '@/modules/categories/models/sub-categories.types'
import { subCategoriesService } from '@/modules/categories/services/sub-category.service'

const UpdateSubCategoryDialog = dynamic(() =>
	import('./update-subcategory/update-subcategory-dialog').then(
		m => m.UpdateSubCategoryDialog
	)
)

interface AdminSubCategoriesListProps {
	query?: PaginateQuery
}

export const AdminSubCategoriesList = ({
	query
}: AdminSubCategoriesListProps) => {
	const queryClient = useQueryClient()
	const [limit, setLimit] = useState(DEFAULT_LIMIT)
	const [selectedSubCategory, setSelectedSubCategory] =
		useState<SubCategory | null>(null)
	const { isOpen: isUpdateDialogOpen, toggleDialog: toggleUpdateDialog } =
		useDialog()

	const { data: subCategories } = useAdminSubCategories({ ...query, limit })

	const handleLoadMore = () => {
		const leftItemsCount = subCategories.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	const { mutate: deleteSubCategory } = useMutation({
		mutationFn: (id: string) => subCategoriesService.deleteSubCategory(id),
		onSuccess: () => {
			toast.success('Подкатегория успешно удалена')
			queryClient.invalidateQueries({
				queryKey: [ADMIN_SUBCATEGORIES_QUERY_KEY]
			})
		},
		onError: () => {
			toast.error('Ошибка при удалении подкатегории')
		}
	})

	const onUpdateClick = (subCategory: SubCategory) => {
		setSelectedSubCategory(subCategory)
		toggleUpdateDialog()
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{subCategories.data.length === 0 && (
				<p className='text-muted-foreground'>Подкатегории не найдены</p>
			)}
			{subCategories.data.length > 0 && (
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
						{subCategories.data.map(subCategory => (
							<TableRow key={subCategory.id}>
								<TableCell className='hidden sm:table-cell'>
									<Image
										alt={subCategory.name}
										className='aspect-square rounded-md bg-muted object-contain'
										height='64'
										src={getProductImageUrl(undefined)}
										loading='lazy'
										width='64'
									/>
								</TableCell>
								<TableCell className='font-medium'>
									{subCategory.name}
								</TableCell>
								<TableCell className='font-medium'>
									<div className='float-right flex items-center'>
										<Button
											variant='ghost'
											size='icon'
											onClick={() => onUpdateClick(subCategory)}
										>
											<Pencil className='h-5 w-5' />
										</Button>

										<Button
											variant='ghost'
											size='icon'
											className='hover:text-destructive'
											onClick={() => deleteSubCategory(subCategory.id)}
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

			{subCategories.meta.totalItems - limit > 0 && (
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

			{isUpdateDialogOpen && selectedSubCategory && (
				<UpdateSubCategoryDialog
					isOpen={isUpdateDialogOpen}
					toggleDialog={toggleUpdateDialog}
					subCategory={selectedSubCategory}
				/>
			)}
		</Suspense>
	)
}
