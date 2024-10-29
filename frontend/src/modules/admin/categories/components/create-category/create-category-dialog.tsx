import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_CATEGORIES_QUERY_KEY } from '../../hooks/use-admin-categories.hook'

import {
	CreateCategorySchemaType,
	createCategorySchema
} from './create-category-schema'
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
import { CreateCategoryDTO } from '@/modules/categories/models/categories.types'
import { categoriesService } from '@/modules/categories/services/categories.service'

interface CreateCategoryDialogProps extends DialogProps {}

export const CreateCategoryDialog = ({
	isOpen,
	toggleDialog
}: CreateCategoryDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<CreateCategorySchemaType>({
		resolver: zodResolver(createCategorySchema),
		defaultValues: {
			name: ''
		}
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'subCategories'
	})

	const { mutate: createCategory, isPending } = useMutation({
		mutationFn: (dto: CreateCategoryDTO) =>
			categoriesService.createCategory(dto),
		onSuccess: () => {
			toast.success('Категория успешно создана')
			queryClient.invalidateQueries({ queryKey: [ADMIN_CATEGORIES_QUERY_KEY] })
			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при cоздании категории')
		}
	})

	const onSubmit = (data: CreateCategorySchemaType) => {
		createCategory(data)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Создание категории</DialogTitle>
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

								<Button
									type='button'
									size='icon'
									variant='ghost'
									onClick={() => remove(index)}
								>
									<Trash className='h-5 w-5' />
								</Button>
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
