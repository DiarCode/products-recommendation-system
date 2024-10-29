'use client'

import { UseFormReturn } from 'react-hook-form'

import { AdminProductFormData } from './admin-product-details-schema'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'
import {
	Products,
	ProductsStatus
} from '@/modules/products/models/products.types'

interface AdminProductStatusProps {
	form: UseFormReturn<AdminProductFormData>
}

const STATUSES_LIST = [
	{ value: ProductsStatus.ACTIVE, label: 'Активный' },
	{ value: ProductsStatus.ARCHIVED, label: 'Архивный' }
]

export const AdminProductStatus = ({ form }: AdminProductStatusProps) => {
	const { setValue, watch } = form
	const status = watch('status')

	return (
		<Card className='shadow-none'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-lg'>Статус товара</CardTitle>
				<CardDescription>
					Активные продукты видны пользователям, в то время как архивированные
					скрыты.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-6'>
					<div className='grid gap-3'>
						<Select
							value={status}
							onValueChange={value =>
								setValue('status', value as ProductsStatus)
							}
						>
							<SelectTrigger
								id='status'
								aria-label='Выберите статус'
							>
								<SelectValue placeholder='Выберите статус' />
							</SelectTrigger>
							<SelectContent>
								{STATUSES_LIST.map(status => (
									<SelectItem
										key={status.value}
										value={status.value}
									>
										{status.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
