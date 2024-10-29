import { z } from 'zod'

import {
	PASSWORD_VALIDATE_SCHEMA,
	PHONE_VALIDATE_SCHEMA
} from '@/core/schemas/profile.schemas'

export const loginFormSchema = z.object({
	phone: PHONE_VALIDATE_SCHEMA,
	password: PASSWORD_VALIDATE_SCHEMA
})

export type LoginFormData = z.infer<typeof loginFormSchema>
