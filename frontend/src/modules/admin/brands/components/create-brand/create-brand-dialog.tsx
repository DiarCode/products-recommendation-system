import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Trash } from 'lucide-react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_BRANDS_QUERY_KEY } from '../../hooks/use-admin-brands.hook'

import { CreateBrandSchemaType, createBrandSchema } from './create-brand-schema'
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
import { Textarea } from '@/core/components/ui/textarea'
import { DialogProps } from '@/core/hooks/use-dialog.hook'
import { brandService } from '@/modules/brands/services/brands.service'

interface CreateBrandDialogProps extends DialogProps {}

export const CreateBrandDialog = ({
	isOpen,
	toggleDialog
}: CreateBrandDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<CreateBrandSchemaType>({
		resolver: zodResolver(createBrandSchema)
	})

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: 'brandCategories'
	})

	const { mutate: createBrand, isPending } = useMutation({
		mutationFn: (dto: CreateBrandSchemaType) => brandService.createBrand(dto),
		onSuccess: () => {
			toast.success('Бренд успешно создан')
			queryClient.invalidateQueries({ queryKey: [ADMIN_BRANDS_QUERY_KEY] })
			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при создании бренда')
		}
	})

	const onSubmit = (data: CreateBrandSchemaType) => {
		createBrand(data)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Создание бренда</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='max-h-[70vh] space-y-4 overflow-y-auto p-[1px]'
					>
						{/* Brand Name */}
						<FormField
							control={form.control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Имя бренда</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите имя бренда'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='description'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Описание бренда</FormLabel>
									<FormControl>
										<Textarea
											placeholder='Введите описание бренда'
											className='max-h-32'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='url'
							render={({ field }) => (
								<FormItem>
									<FormLabel>URL бренда</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите URL бренда'
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
									name={`brandCategories.${index}.name`}
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
