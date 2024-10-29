import { z } from 'zod'

import { PHONE_VALIDATE_SCHEMA } from '@/core/schemas/profile.schemas'

export const profileSettingsSchema = z.object({
	firstName: z.string().min(1, 'Имя обязательно'),
	lastName: z.string().min(1, 'Фамилия обязательна'),
	phone: PHONE_VALIDATE_SCHEMA
})

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>
