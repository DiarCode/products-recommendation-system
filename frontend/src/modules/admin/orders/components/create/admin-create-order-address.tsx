'use client'

import { UseFormReturn } from 'react-hook-form'

import { AdminCreateOrderFormData } from './admin-create-order-schema'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'

interface AdminCreateOrderAddressFormProps {
	form: UseFormReturn<AdminCreateOrderFormData>
}

export const AdminCreateOrderAddressForm = ({
	form
}: AdminCreateOrderAddressFormProps) => {
	return (
		<Card className='shadow-none'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-lg'>Адрес доставки</CardTitle>
				<CardDescription>
					Пожалуйста, заполните форму с актуальной информацией об адресе
					доставки.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-5'>
					<FormField
						control={form.control}
						name='address.country'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Страна</FormLabel>
								<FormControl>
									<Input
										disabled
										placeholder='Введите название страны'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='address.city'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Город</FormLabel>
								<FormControl>
									<Input
										placeholder='Введите название города'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='address.address'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Адрес</FormLabel>
								<FormControl>
									<Input
										placeholder='Введите адрес'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</CardContent>
		</Card>
	)
}
