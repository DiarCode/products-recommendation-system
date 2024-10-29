import { z } from 'zod'

import {
	PASSWORD_VALIDATE_SCHEMA,
	PHONE_VALIDATE_SCHEMA
} from '@/core/schemas/profile.schemas'

export const signupFormSchema = z.object({
	firstName: z.string().min(1, { message: 'Имя обязательное поле' }),
	lastName: z.string().min(1, { message: 'Фамилия обязательное поле' }),
	phone: PHONE_VALIDATE_SCHEMA,
	password: PASSWORD_VALIDATE_SCHEMA
})

export type SignupFormData = z.infer<typeof signupFormSchema>
