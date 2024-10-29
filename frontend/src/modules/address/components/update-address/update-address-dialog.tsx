import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADDRESSES_QUERY_KEY } from '../../hooks/use-adresses.hook'
import { UpdateAddressDto } from '../../models/address-dto.types'
import { Address } from '../../models/address.types'
import { addressService } from '../../services/address.service'

import {
	UpdateAddressFormData,
	updateAddressSchema
} from './update-form.schema'
import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogContent,
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

interface UpdateAddressDialogProps extends DialogProps {
	address: Address
}

export const UpdateAddressDialog = ({
	isOpen,
	toggleDialog,
	address
}: UpdateAddressDialogProps) => {
	const queryClient = useQueryClient()

	const form = useForm<UpdateAddressFormData>({
		resolver: zodResolver(updateAddressSchema),
		defaultValues: {
			country: address.country,
			address: address.address,
			city: address.city
		}
	})

	const { mutate, isPending } = useMutation({
		mutationFn: (dto: UpdateAddressDto) => addressService.updateAddress(dto),
		onSuccess: () => {
			toast.success('Адрес успешно обновлен')
			queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] })
			toggleDialog()
		},
		onError: () => {
			toast.error('Ошибка при обновлении адреса')
		}
	})

	const onSubmit = (data: UpdateAddressFormData) => {
		const dto: UpdateAddressDto = {
			id: address.id,
			city: data.city,
			address: data.address,
			country: data.country
		}

		mutate(dto)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Изменить адрес</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-4'
					>
						<FormField
							control={form.control}
							name='country'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Страна</FormLabel>
									<FormControl>
										<Input
											disabled
											placeholder='Введите вашу страну'
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{form.formState.errors.country?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='city'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Город</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите ваш город'
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{form.formState.errors.city?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='address'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Адрес</FormLabel>
									<FormControl>
										<Input
											placeholder='Введите ваш адрес'
											{...field}
										/>
									</FormControl>
									<FormMessage>
										{form.formState.errors.address?.message}
									</FormMessage>
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={isPending}
						>
							{!isPending ? 'Сохранить' : 'Загрузка...'}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}
