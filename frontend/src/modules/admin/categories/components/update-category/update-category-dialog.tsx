import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	ADMIN_CATEGORIES_QUERY_KEY,
	ADMIN_CATEGORY_DETAILS_QUERY_KEY
} from '../../hooks/use-admin-categories.hook'

import {
	UpdateCategorySchemaType,
	updateCategorySchema
} from './update-category-schema'
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
	Category,
	UpdateCategoryDTO
} from '@/modules/categories/models/categories.types'
import { categoriesService } from '@/modules/categories/services/categories.service'

interface UpdateCategoryDialogProps extends DialogProps {
	category: Category
}

export const UpdateCategoryDialog = ({
	isOpen,
	toggleDialog,
	category
}: UpdateCategoryDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<UpdateCategorySchemaType>({
		resolver: zodResolver(updateCategorySchema),
		defaultValues: {
			name: category.name
		}
	})

	const { mutate: updateCategory, isPending } = useMutation({
		mutationFn: ({ id, dto }: { id: string; dto: UpdateCategoryDTO }) =>
			categoriesService.updateCategory(id, dto),
		onSuccess: () => {
			toast.success('Категория успешно обновлена')
			queryClient.invalidateQueries({ queryKey: [ADMIN_CATEGORIES_QUERY_KEY] })
			queryClient.invalidateQueries({
				queryKey: [ADMIN_CATEGORY_DETAILS_QUERY_KEY, category.id]
			})

			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при обновлении категории')
		}
	})

	const onSubmit = (data: UpdateCategorySchemaType) => {
		updateCategory({ id: category.id, dto: data })
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
