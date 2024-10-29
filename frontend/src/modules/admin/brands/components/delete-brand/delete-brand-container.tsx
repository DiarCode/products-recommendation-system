'use client'

import { useRouter } from 'next/navigation'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { toast } from 'sonner'

import { ADMIN_BRANDS_QUERY_KEY } from '../../hooks/use-admin-brands.hook'

import { Button } from '@/core/components/ui/button'
import { Brands } from '@/modules/brands/models/brands.types'
import { brandService } from '@/modules/brands/services/brands.service'

interface DeleteBrandContainerProps {
	brand: Brands
}

export const DeleteBrandContainer = ({ brand }: DeleteBrandContainerProps) => {
	const queryClient = useQueryClient()
	const router = useRouter()

	const { mutate: deleteCategory } = useMutation({
		mutationFn: (id: string) => brandService.deleteBrand(id),
		onSuccess: () => {
			toast.success('Бренд успешно удалена')
			queryClient.invalidateQueries({ queryKey: [ADMIN_BRANDS_QUERY_KEY] })
			router.push('/admin/brands')
		},
		onError: () => {
			toast.error('Ошибка при удалении бренда')
		}
	})

	const onDeleteClick = () => {
		if (
			brand.brandCategories.length > 0 &&
			!window.confirm(
				`Бренд содержит ${brand.brandCategories.length} категорий. Действительно хотите удалить?`
			)
		)
			return

		deleteCategory(brand.id)
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
