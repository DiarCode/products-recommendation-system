import { z } from 'zod'

export const updateBrandSchema = z.object({
	name: z
		.string({ required_error: 'Имя бренда обязательно' })
		.min(1, 'Имя бренда не может быть пустым'),
	description: z
		.string({ required_error: 'Имя бренда обязательно' })
		.min(1, 'Имя бренда не может быть пустым'),
	url: z
		.string({ required_error: 'Имя бренда обязательно' })
		.min(1, 'Имя бренда не может быть пустым')
})

export type UpdateBrandSchemaType = z.infer<typeof updateBrandSchema>
