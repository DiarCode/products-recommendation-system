import { z } from 'zod'

export const updateCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя категории обязательно' })
		.min(1, 'Имя категории не может быть пустым')
})

export type UpdateCategorySchemaType = z.infer<typeof updateCategorySchema>
