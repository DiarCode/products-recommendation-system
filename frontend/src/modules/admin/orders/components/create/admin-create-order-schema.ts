import { z } from 'zod'

const addressSchema = z.object({
	city: z.string().min(1, { message: 'Город не может быть пустым.' }),
	country: z.string().min(1, { message: 'Страна не может быть пустой.' }),
	address: z.string().min(1, { message: 'Адрес не может быть пустым.' })
})

const orderItemSchema = z.object({
	product: z.object({
		id: z.string(),
		name: z.string(),
		subCategory: z.object({
			name: z.string()
		}),
		brand: z.object({
			name: z.string()
		}),
		price: z.number(),
		images: z.array(z.string())
	}),
	quantity: z.number().min(1, { message: 'Количество должно быть больше 0.' })
})

export const adminCreateOrderSchema = z.object({
	address: addressSchema,
	orderItems: z.array(orderItemSchema).refine(data => data.length > 0, {
		message: 'Заказ должен содержать хотя бы один товар.'
	}),
	notes: z.string().optional()
})

export type AdminCreateOrderFormData = z.infer<typeof adminCreateOrderSchema>
