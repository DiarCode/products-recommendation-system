import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	ADMIN_BRANDS_QUERY_KEY,
	ADMIN_BRAND_DETAILS_QUERY_KEY
} from '../../hooks/use-admin-brands.hook'

import { UpdateBrandSchemaType, updateBrandSchema } from './update-brand-schema'
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
import { Brands } from '@/modules/brands/models/brands.types'
import { brandService } from '@/modules/brands/services/brands.service'

interface UpdateBrandDialogProps extends DialogProps {
	brand: Brands
}

export const UpdateBrandDialog = ({
	isOpen,
	toggleDialog,
	brand
}: UpdateBrandDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<UpdateBrandSchemaType>({
		resolver: zodResolver(updateBrandSchema),
		defaultValues: {
			name: brand.name,
			url: brand.url,
			description: brand.description
		}
	})

	const { mutate: updateBrand, isPending } = useMutation({
		mutationFn: (dto: UpdateBrandSchemaType) =>
			brandService.updateBrand(brand.id, dto),
		onSuccess: () => {
			toast.success('Бренд успешно обновлен')
			queryClient.invalidateQueries({ queryKey: [ADMIN_BRANDS_QUERY_KEY] })
			queryClient.invalidateQueries({
				queryKey: [ADMIN_BRAND_DETAILS_QUERY_KEY, brand.id]
			})
			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при обновлении бренда')
		}
	})

	const onSubmit = (data: UpdateBrandSchemaType) => {
		updateBrand(data)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='max-h-[95vh]'>
				<DialogHeader>
					<DialogTitle>Обновить бренд</DialogTitle>
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
