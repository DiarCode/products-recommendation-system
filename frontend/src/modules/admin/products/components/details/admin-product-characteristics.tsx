'use client'

import React, { useEffect } from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'

import { AdminProductFormData } from './admin-product-details-schema'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { Input } from '@/core/components/ui/input'

interface ProductCharacteristicsProps {
	form: UseFormReturn<AdminProductFormData>
}

export const AdminProductCharacteristics = ({
	form
}: ProductCharacteristicsProps) => {
	const { control, setValue } = form

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'characteristics'
	})

	useEffect(() => {
		const characteristics = form.getValues('characteristics')
		if (!characteristics || characteristics.length === 0) {
			append({ key: '', value: '' })
		} else {
			characteristics.forEach((char, index) => {
				setValue(`characteristics.${index}.key`, char.key)
				setValue(`characteristics.${index}.value`, char.value)
			})
		}
	}, [append, form, setValue])

	const handleAddCharacteristic = () => {
		append({ key: '', value: '' })
	}

	return (
		<Card className='shadow-none'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-lg'>Характеристики продукта</CardTitle>
				<CardDescription>
					Пожалуйста, укажите ключевые характеристики вашего продукта. Каждая
					характеристика должна содержать имя и значение.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='flex flex-col gap-4'>
					{fields.map((characteristic, index) => (
						<div
							key={characteristic.id}
							className='flex items-center gap-2'
						>
							<div className='flex-1'>
								<Input
									{...form.register(`characteristics.${index}.key` as const)}
									placeholder='Ключ'
								/>
							</div>

							<div className='flex-1'>
								<Input
									{...form.register(`characteristics.${index}.value` as const)}
									placeholder='Значение'
								/>
							</div>

							<Button
								onClick={() => remove(index)}
								variant='ghost'
								type='button'
							>
								Удалить
							</Button>
						</div>
					))}
					<Button
						onClick={handleAddCharacteristic}
						variant='outline'
						className='w-fit'
						type='button'
					>
						Добавить
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
