import { z } from 'zod'

export const storeConfigSchema = z.object({
	storeName: z.string().min(1, 'Название магазина обязательно'),
	storeDescription: z.string().min(1, 'Описание магазина обязательно'),
	storeKeywords: z.string().min(1, 'Ключевые слова обязательны')
})

export type StoreConfigFormData = z.infer<typeof storeConfigSchema>
