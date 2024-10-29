import { z } from 'zod'

export const updateBrandCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя категории обязательно' })
		.min(1, 'Имя категории не может быть пустым')
})

export type UpdateBrandCategorySchemaType = z.infer<
	typeof updateBrandCategorySchema
>
