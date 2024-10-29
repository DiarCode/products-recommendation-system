import { z } from 'zod'

const brandCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя категории обязательно' })
		.min(1, 'Имя категории не может быть пустым')
})

export const createBrandSchema = z.object({
	name: z
		.string({ required_error: 'Имя бренда обязательно' })
		.min(1, 'Имя бренда не может быть пустым'),
	description: z
		.string({ required_error: 'Имя бренда обязательно' })
		.min(1, 'Имя бренда не может быть пустым'),
	url: z
		.string({ required_error: 'Имя бренда обязательно' })
		.min(1, 'Имя бренда не может быть пустым'),
	brandCategories: z.array(brandCategorySchema).optional()
})

export type CreateBrandSchemaType = z.infer<typeof createBrandSchema>
