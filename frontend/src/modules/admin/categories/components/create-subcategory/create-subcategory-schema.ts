import { z } from 'zod'

const subCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя подкатегории обязательно' })
		.min(1, 'Имя подкатегории не может быть пустым')
})

export const createSubCategorySchema = z.object({
	subCategories: z.array(subCategorySchema)
})

export type CreateSubCategorySchemaType = z.infer<
	typeof createSubCategorySchema
>
