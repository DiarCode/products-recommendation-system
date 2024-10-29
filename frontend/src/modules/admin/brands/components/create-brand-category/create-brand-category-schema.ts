import { z } from 'zod'

const brandCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя категории обязательно' })
		.min(1, 'Имя категории не может быть пустым')
})

export const createBrandCategorySchema = z.object({
	brandCategories: z.array(brandCategorySchema)
})

export type CreateBrandCategorySchemaType = z.infer<
	typeof createBrandCategorySchema
>
