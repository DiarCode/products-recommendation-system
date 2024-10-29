'use client'

import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { ADMIN_CATEGORIES_QUERY_KEY } from '../../hooks/use-admin-categories.hook'

import { Button } from '@/core/components/ui/button'
import { Category } from '@/modules/categories/models/categories.types'
import { categoriesService } from '@/modules/categories/services/categories.service'

interface DeleteCategoryContainerProps {
	category: Category
}

export const DeleteCategoryContainer = ({
	category
}: DeleteCategoryContainerProps) => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: deleteCategory } = useMutation({
		mutationFn: (id: string) => categoriesService.deleteCategory(id),
		onSuccess: () => {
			toast.success('Категория успешно удалена')
			queryClient.invalidateQueries({ queryKey: [ADMIN_CATEGORIES_QUERY_KEY] })
			router.push('/admin/categories')
		},
		onError: () => {
			toast.error('Ошибка при удалении категории')
		}
	})

	const onDeleteClick = () => {
		if (
			category.subCategories.length > 0 &&
			!window.confirm(
				`Категория содержит ${category.subCategories.length} подкатегорий. Действительно хотите удалить?`
			)
		)
			return

		deleteCategory(category.id)
	}

	return (
		<div>
			<Button
				size='icon'
				variant='ghost'
				onClick={onDeleteClick}
				className='hover:text-destructive'
			>
				<Trash className='h-5 w-5' />
			</Button>
		</div>
	)
}
