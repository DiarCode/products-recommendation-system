import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_SUBCATEGORIES_QUERY_KEY } from '../../hooks/use-admin-subcategories.hook'

import {
	UpdateSubCategorySchemaType,
	updateSubCategorySchema
} from './update-subcategory-schema'
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
import {
	SubCategory,
	UpdateSubCategoryDTO
} from '@/modules/categories/models/sub-categories.types'
import { subCategoriesService } from '@/modules/categories/services/sub-category.service'

interface UpdateSubCategoryDialogProps extends DialogProps {
	subCategory: SubCategory
}

export const UpdateSubCategoryDialog = ({
	isOpen,
	toggleDialog,
	subCategory
}: UpdateSubCategoryDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<UpdateSubCategorySchemaType>({
		resolver: zodResolver(updateSubCategorySchema),
		defaultValues: {
			name: subCategory.name
		}
	})

	const { mutate: updateSubCategory, isPending } = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateSubCategoryDTO }) =>
			subCategoriesService.updateSubCategory(id, dto),
		onSuccess: () => {
			toast.success('Подкатегория успешно обновлена')
			queryClient.invalidateQueries({
				queryKey: [ADMIN_SUBCATEGORIES_QUERY_KEY]
			})

			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при обновлении подкатегории')
		}
	})

	const onSubmit = (data: UpdateSubCategorySchemaType) => {
		updateSubCategory({ id: subCategory.id, dto: data })
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Обновить подкатегорию</DialogTitle>
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
									<FormLabel>Имя подкатегории</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите имя подкатегории'
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
