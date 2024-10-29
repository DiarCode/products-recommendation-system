import { z } from 'zod'

const subCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя подкатегории обязательно' })
		.min(1, 'Имя подкатегории не может быть пустым')
})

export const createCategorySchema = z.object({
	name: z
		.string({ required_error: 'Имя категории обязательно' })
		.min(1, 'Имя категории не может быть пустым'),
	subCategories: z.array(subCategorySchema).optional()
})

export type CreateCategorySchemaType = z.infer<typeof createCategorySchema>
