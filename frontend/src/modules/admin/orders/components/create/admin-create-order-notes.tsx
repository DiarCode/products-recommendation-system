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
import { Textarea } from '@/core/components/ui/textarea'

interface AdminCreateOrderNotesFormProps {
	form: UseFormReturn<AdminCreateOrderFormData>
}

export const AdminCreateOrderNotesForm = ({
	form
}: AdminCreateOrderNotesFormProps) => {
	return (
		<Card className='shadow-none'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-lg'>Комментарий (опционально)</CardTitle>
				<CardDescription>Добавьте комментарий к заказу</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-5'>
					<FormField
						control={form.control}
						name='notes'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Комментарий</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Введите ваш комментарий'
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
