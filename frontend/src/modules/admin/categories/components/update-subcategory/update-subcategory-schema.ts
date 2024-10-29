import { z } from 'zod'

export const updateSubCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя подкатегории обязательно' })
		.min(1, 'Имя подкатегории не может быть пустым')
})

export type UpdateSubCategorySchemaType = z.infer<
	typeof updateSubCategorySchema
>
