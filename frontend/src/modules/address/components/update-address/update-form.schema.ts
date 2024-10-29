import { z } from 'zod'

export const updateAddressSchema = z.object({
	city: z.string().min(1, { message: 'City is required' }),
	country: z.string().min(1, { message: 'Country is required' }),
	address: z.string().min(1, { message: 'Address is required' })
})

export type UpdateAddressFormData = z.infer<typeof updateAddressSchema>
