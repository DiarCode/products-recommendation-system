'use client'

import dynamic from 'next/dynamic'

import { UseFormReturn } from 'react-hook-form'

import { AdminProductFormData } from './admin-product-details-schema'
import { Button } from '@/core/components/ui/button'
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
import { Label } from '@/core/components/ui/label'
import { Textarea } from '@/core/components/ui/textarea'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { SelectBrandCategoryDialog } from '@/modules/brands/components/select-brand-category-dialog'
import { Products } from '@/modules/products/models/products.types'

const SelectSubCategoryDialog = dynamic(() =>
	import('@/modules/categories/components/select-subcategory-dialog').then(
		m => m.SelectSubCategoryDialog
	)
)

interface AdminProductInfoChangeProps {
	form: UseFormReturn<AdminProductFormData>
}

export const AdminProductInfoChange = ({
	form
}: AdminProductInfoChangeProps) => {
	const { isOpen: isSubCategoryOpen, toggleDialog: toggleSubCategoryDialog } =
		useDialog()
	const { isOpen: isBrandDialogOpen, toggleDialog: toggleBrandDialog } =
		useDialog()

	return (
		<Card className='shadow-none'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-lg'>Информация о продукте</CardTitle>
				<CardDescription>
					Здесь вы можете обновить информацию о продукте. Убедитесь, что все
					данные корректны перед сохранением.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='grid gap-8'>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Название продукта</FormLabel>
								<FormControl>
									<Input
										placeholder='Введите название продукта'
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
								<FormLabel>Описание продукта</FormLabel>
								<FormControl>
									<Textarea
										placeholder='Введите описание продукта'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className='grid grid-cols-2 gap-6'>
						<FormField
							control={form.control}
							name='price'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Цена (₸)</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Введите цену'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='stock'
							render={({ field }) => (
								<FormItem>
									<FormLabel>На складе</FormLabel>
									<FormControl>
										<Input
											type='number'
											placeholder='Количество на складе'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className='grid grid-cols-2 gap-6'>
						<div>
							<FormField
								control={form.control}
								name='subCategory'
								render={({ field }) => (
									<FormItem className='flex flex-col'>
										<FormLabel>Подкатегория</FormLabel>
										<FormControl>
											{!field.value?.name ? (
												<Button
													onClick={toggleSubCategoryDialog}
													variant='link'
													className='w-fit p-0'
													type='button'
												>
													Выбрать подкатегорию товара
												</Button>
											) : (
												<Button
													onClick={toggleSubCategoryDialog}
													variant='link'
													type='button'
													className='w-fit p-0'
												>
													{field.value.name}
												</Button>
											)}
										</FormControl>
										<FormMessage />

										{isSubCategoryOpen && (
											<SelectSubCategoryDialog
												isOpen={isSubCategoryOpen}
												initialSubCategory={field.value}
												toggleDialog={toggleSubCategoryDialog}
												onSelectSubCategory={subCategory => {
													form.setValue('subCategory', subCategory)
												}}
											/>
										)}
									</FormItem>
								)}
							/>
						</div>

						<div>
							<FormField
								control={form.control}
								name='brandCategory'
								render={({ field }) => (
									<FormItem className='flex flex-col'>
										<FormLabel>Категория бренда</FormLabel>
										<FormControl>
											{!field.value?.name ? (
												<Button
													onClick={toggleBrandDialog}
													variant='link'
													className='w-fit p-0'
													type='button'
												>
													Выбрать бренд товара
												</Button>
											) : (
												<Button
													onClick={toggleBrandDialog}
													variant='link'
													type='button'
													className='w-fit p-0'
												>
													{field.value.name}
												</Button>
											)}
										</FormControl>
										<FormMessage />

										{isBrandDialogOpen && (
											<SelectBrandCategoryDialog
												isOpen={isBrandDialogOpen}
												initialBrandCategory={field.value}
												toggleDialog={toggleBrandDialog}
												onSelectBrandCategory={brandCategory => {
													form.setValue('brandCategory', {
														name: brandCategory.name ?? '',
														id: brandCategory.id ?? ''
													})
												}}
											/>
										)}
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
