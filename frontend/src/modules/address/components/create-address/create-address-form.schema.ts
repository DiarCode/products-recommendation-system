import { z } from 'zod'

export const createAddressSchema = z.object({
	city: z.string().min(1, { message: 'City is required' }),
	country: z.string().min(1, { message: 'Country is required' }),
	address: z.string().min(1, { message: 'Address is required' })
})

export type CreateAddressFormData = z.infer<typeof createAddressSchema>
