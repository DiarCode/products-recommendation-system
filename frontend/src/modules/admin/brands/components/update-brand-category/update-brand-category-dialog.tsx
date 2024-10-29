import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_BRAND_CATEGORIES_QUERY_KEY } from '../../hooks/use-admin-brand-categories.hook'

import {
	UpdateBrandCategorySchemaType,
	updateBrandCategorySchema
} from './update-brand-category-schema'
import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { DialogProps } from '@/core/hooks/use-dialog.hook'
import { BrandCategory } from '@/modules/brands/models/brand-category.types'
import { brandCategoriesService } from '@/modules/brands/services/brand-category.service'

interface UpdateBrandCategoryDialogProps extends DialogProps {
	brandCategory: BrandCategory
}

export const UpdateBrandCategoryDialog = ({
	isOpen,
	toggleDialog,
	brandCategory
}: UpdateBrandCategoryDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<UpdateBrandCategorySchemaType>({
		resolver: zodResolver(updateBrandCategorySchema),
		defaultValues: {
			name: brandCategory.name
		}
	})

	const { mutate: updateBrandCategory, isPending } = useMutation({
		mutationFn: (dto: UpdateBrandCategorySchemaType) =>
			brandCategoriesService.updateBrandCategory(brandCategory.id, dto),
		onSuccess: () => {
			toast.success('Категория успешно обновлена')
			queryClient.invalidateQueries({
				queryKey: [ADMIN_BRAND_CATEGORIES_QUERY_KEY]
			})

			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при обновлении категории')
		}
	})

	const onSubmit = (data: UpdateBrandCategorySchemaType) => {
		updateBrandCategory(data)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Обновить категорию</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='max-h-[70vh] space-y-4 overflow-y-auto p-[1px]'
					>
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя категории</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите имя категории'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter className='mt-4 gap-2 sm:justify-end'>
							<Button
								type='button'
								variant='outline'
								disabled={isPending}
								onClick={toggleDialog}
							>
								Отменить
							</Button>

							<Button
								type='submit'
								variant='default'
								disabled={isPending}
							>
								Обновить
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
