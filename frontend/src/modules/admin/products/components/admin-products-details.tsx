'use client'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { AdminProductCharacteristics } from './details/admin-product-characteristics'
import {
	AdminProductFormData,
	adminProductSchema
} from './details/admin-product-details-schema'
import { AdminProductImages } from './details/admin-product-images'
import { AdminProductInfoChange } from './details/admin-product-info'
import { AdminProductStatus } from './details/admin-product-status'
import { Button } from '@/core/components/ui/button'
import { Form } from '@/core/components/ui/form'
import { getPage } from '@/core/config/pages.config'
import {
	PRODUCTS_QUERY_KEY,
	PRODUCT_DETAILS_QUERY_KEY
} from '@/modules/products/hooks/use-products'
import {
	CreateProductDto,
	UpdateProductDto
} from '@/modules/products/models/products-dto.types'
import {
	Products,
	ProductsStatus
} from '@/modules/products/models/products.types'
import { productsService } from '@/modules/products/services/products.service'

interface ProductDetailsProps {
	product?: Products
	type: 'CREATE' | 'UPDATE'
}

export const ProductsDetails = ({ product, type }: ProductDetailsProps) => {
	const [images, setImages] = useState<(File | string)[]>(product?.images || [])

	const form = useForm<AdminProductFormData>({
		resolver: zodResolver(adminProductSchema),
		defaultValues: {
			name: product?.name,
			description: product?.description,
			price: product?.price,
			stock: product?.stock,
			subCategory: product?.subCategory,
			brandCategory: product?.brandCategory,
			characteristics: Object.entries(product?.characteristics ?? {}).map(
				([key, value]) => ({ key, value })
			),
			status: type === 'CREATE' ? ProductsStatus.ACTIVE : product?.status
		}
	})

	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate: updateProductMutation, isPending: isProductUpdatePending } =
		useMutation({
			mutationFn: ({ id, dto }: { id: string; dto: UpdateProductDto }) =>
				productsService.updateProduct(id, dto),
			onSuccess: () => {
				toast.success('Продукт успешно обновлен')
				queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })

				if (product?.id) {
					queryClient.invalidateQueries({
						queryKey: [PRODUCT_DETAILS_QUERY_KEY, product.id]
					})
				}
				router.push(getPage('ADMIN_PRODUCTS').href)
			},
			onError: () => {
				toast.error('Ошибка при обновлении продукта')
			}
		})

	const { mutate: createProductMutation, isPending: isProductCreatePending } =
		useMutation({
			mutationFn: (dto: CreateProductDto) => productsService.createProduct(dto),
			onSuccess: () => {
				toast.success('Продукт успешно создан')
				queryClient.invalidateQueries({ queryKey: [PRODUCTS_QUERY_KEY] })
				router.push(getPage('ADMIN_PRODUCTS').href)
			},
			onError: () => {
				toast.error('Ошибка при создании продукта')
			}
		})

	const onBackClick = () => {
		const confirmed = window.confirm(
			'У вас есть несохраненные изменения. Вы действительно хотите уйти?'
		)
		if (!confirmed) return

		router.back()
	}

	const onRevertClick = () => {
		const confirmed = window.confirm(
			'У вас есть несохраненные изменения. Вы действительно хотите все вернуть?'
		)

		if (!confirmed) return

		form.reset()
	}

	const onSubmit = (values: AdminProductFormData) => {
		const characteristicsRecord: Record<string, string> =
			values.characteristics.reduce(
				(acc, { key, value }) => {
					acc[key] = value
					return acc
				},
				{} as Record<string, string>
			)

		if (type === 'CREATE') {
			const uploadedImages = images.filter(image => image instanceof File)

			const dto: CreateProductDto = {
				name: values.name,
				description: values.description,
				subCategoryId: values.subCategory?.id,
				characteristics: characteristicsRecord,
				brandCategoryId: values.brandCategory.id,
				price: values.price,
				stock: values.stock,
				images: uploadedImages
			}

			createProductMutation(dto)
		}

		if (type === 'UPDATE' && product) {
			const imagesToDelete = product?.images.filter(
				image => !images.includes(image)
			)

			const uploadedImages = images.filter(image => typeof image !== 'string')

			const dto: UpdateProductDto = {
				name: values.name,
				description: values.description,
				subCategoryId: values.subCategory?.id,
				characteristics: characteristicsRecord,
				brandCategoryId: values.brandCategory.id,
				price: values.price,
				stock: values.stock,
				status: values.status,
				imagesToDelete: imagesToDelete,
				images: uploadedImages
			}

			updateProductMutation({ id: product.id, dto })
		}
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mx-auto grid max-w-[64rem] flex-1 auto-rows-max gap-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-7 w-7'
						onClick={onBackClick}
						type='button'
					>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Назад</span>
					</Button>
					<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight'>
						{product?.name ?? 'Создать товар'}
					</h1>

					<div className='flex items-center gap-2 md:ml-auto'>
						<Button
							variant='outline'
							size='sm'
							onClick={onRevertClick}
							type='button'
						>
							Отмена
						</Button>
						<Button
							disabled={isProductUpdatePending || isProductCreatePending}
							size='sm'
							type='submit'
						>
							Сохранить
						</Button>
					</div>
				</div>

				<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'>
					<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
						<AdminProductInfoChange form={form} />

						<AdminProductCharacteristics form={form} />
					</div>

					<div className='grid auto-rows-max items-start gap-4'>
						<AdminProductStatus form={form} />

						<AdminProductImages
							images={images}
							setImages={setImages}
						/>
					</div>
				</div>
			</form>
		</Form>
	)
}
