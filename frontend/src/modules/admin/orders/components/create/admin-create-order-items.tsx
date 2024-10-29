'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'

import { Trash } from 'lucide-react'
import { Suspense } from 'react'
import { UseFormReturn, useFieldArray } from 'react-hook-form'

import { AdminCreateOrderFormData } from './admin-create-order-schema'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { Products } from '@/modules/products/models/products.types'

const SelectProductDialog = dynamic(() =>
	import('@/modules/products/components/select-product-dialog').then(
		m => m.SelectProductDialog
	)
)

interface AdminCreateOrderItemsProps {
	form: UseFormReturn<AdminCreateOrderFormData>
}

export const AdminCreateOrderItems = ({ form }: AdminCreateOrderItemsProps) => {
	const {
		isOpen: isSelectProductOpen,
		toggleDialog: toggleSelectProductDialog
	} = useDialog()
	const { control, watch } = form

	const { fields, append, update, remove } = useFieldArray({
		control,
		name: 'orderItems'
	})

	const orderItems = watch('orderItems')

	const onSelectProduct = (product: Products) => {
		const existingItemIndex = orderItems.findIndex(
			item => item.product.id === product.id
		)

		if (existingItemIndex !== -1) {
			const updatedQuantity = orderItems[existingItemIndex].quantity + 1
			update(existingItemIndex, {
				...orderItems[existingItemIndex],
				quantity: updatedQuantity
			})
		} else {
			append({ product, quantity: 1 })
		}

		toggleSelectProductDialog()
	}

	const handleQuantityChange = (index: number, quantity: number) => {
		if (isNaN(quantity)) return
		if (quantity < 1) return
		update(index, { ...orderItems[index], quantity })
	}

	const handleRemoveItem = (index: number) => {
		remove(index)
	}

	return (
		<Card className='shadow-none'>
			<CardHeader>
				<div className='flex items-start justify-between gap-4'>
					<div className='space-y-2'>
						<CardTitle className='text-lg'>Товары заказа</CardTitle>

						<CardDescription>
							Выберите товары и укажите количество для каждого товара.
						</CardDescription>
					</div>

					<Button
						variant='outline'
						onClick={toggleSelectProductDialog}
						type='button'
					>
						Добавить
					</Button>
				</div>
			</CardHeader>
			<CardContent className='w-full'>
				<Suspense fallback={'Загрузка...'}>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='hidden sm:table-cell'>
									<span className='sr-only'>Картина</span>
								</TableHead>
								<TableHead>Название</TableHead>
								<TableHead className='hidden md:table-cell'>
									Подкатегория
								</TableHead>
								<TableHead className='hidden md:table-cell'>Бренд</TableHead>
								<TableHead>Цена</TableHead>
								<TableHead>Кол-во</TableHead>
								<TableHead>Итого</TableHead>
								<TableHead></TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{fields.map(({ product, quantity }, index) => (
								<TableRow key={product.id}>
									<TableCell className='hidden sm:table-cell'>
										<Image
											alt={product.name}
											className='aspect-square rounded-sm bg-muted object-contain'
											height='64'
											src={getProductImageUrl(product.images[0])}
											loading='lazy'
											width='64'
										/>
									</TableCell>
									<TableCell className='font-medium'>{product.name}</TableCell>
									<TableCell>{product.subCategory.name}</TableCell>
									<TableCell>{product.brand.name}</TableCell>
									<TableCell>{formatPrice(product.price)}</TableCell>
									<TableCell>
										<input
											type='number'
											value={quantity}
											min={1}
											onChange={e =>
												handleQuantityChange(index, parseInt(e.target.value))
											}
											className='w-16 rounded border p-1 text-center'
										/>
									</TableCell>
									<TableCell>{formatPrice(quantity * product.price)}</TableCell>
									<TableCell>
										<button
											type='button'
											onClick={() => handleRemoveItem(index)}
											className='rounded-md text-destructive'
										>
											<Trash className='h-4 w-4' />
										</button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Suspense>

				{isSelectProductOpen && (
					<SelectProductDialog
						isOpen={isSelectProductOpen}
						toggleDialog={toggleSelectProductDialog}
						onSelectProduct={onSelectProduct}
					/>
				)}
			</CardContent>
		</Card>
	)
}
