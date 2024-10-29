import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_BRAND_CATEGORIES_QUERY_KEY } from '../../hooks/use-admin-brand-categories.hook'

import {
	CreateBrandCategorySchemaType,
	createBrandCategorySchema
} from './create-brand-category-schema'
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
import { CreateBrandCategoriesDTO } from '@/modules/brands/models/brand-category.types'
import { brandCategoriesService } from '@/modules/brands/services/brand-category.service'

interface CreateBrandCategoryDialogProps extends DialogProps {
	brandId: string
}

export const CreateBrandCategoryDialog = ({
	isOpen,
	toggleDialog,
	brandId
}: CreateBrandCategoryDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<CreateBrandCategorySchemaType>({
		resolver: zodResolver(createBrandCategorySchema),
		defaultValues: {
			brandCategories: [{ name: '' }]
		}
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'brandCategories'
	})

	const { mutate: createBrandCategory, isPending } = useMutation({
		mutationFn: (dto: CreateBrandCategoriesDTO) =>
			brandCategoriesService.createBrandCategories(dto),
		onSuccess: () => {
			toast.success('Категории успешно созданы')
			queryClient.invalidateQueries({
				queryKey: [ADMIN_BRAND_CATEGORIES_QUERY_KEY]
			})
			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при cоздании категорий')
		}
	})

	const onSubmit = (data: CreateBrandCategorySchemaType) => {
		const dto: CreateBrandCategoriesDTO = {
			brandCategories: data.brandCategories,
			brandId: brandId
		}

		createBrandCategory(dto)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Создание категорий бренда</DialogTitle>
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
									name={`brandCategories.${index}.name`}
									render={({ field }) => (
										<FormItem className='flex-1'>
											{index === 0 && <FormLabel>Имя категории</FormLabel>}
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
							Добавить категорию
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
