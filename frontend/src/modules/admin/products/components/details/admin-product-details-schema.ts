import { z } from 'zod'

import { ProductsStatus } from '@/modules/products/models/products.types'

export const adminProductSchema = z.object({
	name: z
		.string()
		.min(3, { message: 'Название должно содержать минимум 3 символа.' })
		.max(100, { message: 'Название не должно превышать 100 символов.' }),

	description: z
		.string()
		.min(10, { message: 'Описание должно содержать минимум 10 символов.' }),

	characteristics: z
		.array(
			z.object({
				key: z.string().min(1, { message: 'Ключ не может быть пустым.' }),
				value: z.string().min(1, { message: 'Значение не может быть пустым.' })
			})
		)
		.refine(data => (data ? data.length > 0 : false), {
			message: 'Характеристики не могут быть пустыми.'
		}),

	price: z.coerce
		.number({ invalid_type_error: 'Цена должна быть числом.' })
		.min(1, { message: 'Цена должна быть больше 0.' }),

	stock: z.coerce
		.number({ invalid_type_error: 'Количество должно быть числом.' })
		.min(1, { message: 'Количество должно быть больше 0.' }),

	subCategory: z
		.object({
			id: z
				.string()
				.min(1, { message: 'ID подкатегории не может быть пустым.' }),
			name: z
				.string()
				.min(1, { message: 'Название подкатегории не может быть пустым.' }),
			categoryId: z
				.string()
				.min(1, { message: 'ID категории не может быть пустым.' })
		})
		.refine(subCategory => subCategory.id && subCategory.name, {
			message: 'Подкатегория должна быть выбрана.'
		}),

	brandCategory: z
		.object({
			id: z
				.string()
				.min(1, { message: 'ID категории бренда не может быть пустым.' }),
			name: z
				.string()
				.min(1, { message: 'Название категории бренда не может быть пустым.' })
		})
		.refine(brandCategory => brandCategory.id && brandCategory.name, {
			message: 'Категория бренда должна быть выбрана.'
		}),

	status: z
		.nativeEnum(ProductsStatus, {
			errorMap: () => ({ message: 'Статус должен быть ACTIVE или INACTIVE.' })
		})
		.optional()
})

export type AdminProductFormData = z.infer<typeof adminProductSchema>
