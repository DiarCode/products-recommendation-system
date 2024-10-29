import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_SUBCATEGORIES_QUERY_KEY } from '../../hooks/use-admin-subcategories.hook'

import {
	CreateSubCategorySchemaType,
	createSubCategorySchema
} from './create-subcategory-schema'
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
import { CreateSubCategoryDTO } from '@/modules/categories/models/sub-categories.types'
import { subCategoriesService } from '@/modules/categories/services/sub-category.service'

interface CreateSubCategoryDialogProps extends DialogProps {
	categoryId: string
}

export const CreateSubCategoryDialog = ({
	isOpen,
	toggleDialog,
	categoryId
}: CreateSubCategoryDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<CreateSubCategorySchemaType>({
		resolver: zodResolver(createSubCategorySchema),
		defaultValues: {
			subCategories: [{ name: '' }]
		}
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'subCategories'
	})

	const { mutate: createSubCategory, isPending } = useMutation({
		mutationFn: (dto: CreateSubCategoryDTO) =>
			subCategoriesService.createSubCategories(dto),
		onSuccess: () => {
			toast.success('Подкатегории успешно созданы')
			queryClient.invalidateQueries({
				queryKey: [ADMIN_SUBCATEGORIES_QUERY_KEY]
			})
			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при cоздании подкатегорий')
		}
	})

	const onSubmit = (data: CreateSubCategorySchemaType) => {
		const dto: CreateSubCategoryDTO = {
			subCategories: data.subCategories,
			categoryId: categoryId
		}

		createSubCategory(dto)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Создание подкатегорий</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='max-h-[70vh] space-y-4 overflow-y-auto p-[1px]'
					>
						{fields.map((item, index) => (
							<div
								key={item.id}
								className='flex items-end gap-2'
							>
								<FormField
									control={form.control}
									name={`subCategories.${index}.name`}
									render={({ field }) => (
										<FormItem className='flex-1'>
											{index === 0 && <FormLabel>Имя подкатегории</FormLabel>}
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

								{index !== 0 && (
									<Button
										type='button'
										size='icon'
										variant='ghost'
										onClick={() => remove(index)}
									>
										<Trash className='h-5 w-5' />
									</Button>
								)}
							</div>
						))}

						<Button
							type='button'
							variant='ghost'
							onClick={() => append({ name: '' })}
						>
							Добавить подкатегорию
						</Button>

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
								Создать
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
