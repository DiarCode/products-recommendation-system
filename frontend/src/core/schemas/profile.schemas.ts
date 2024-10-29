import { z } from 'zod'

export const PASSWORD_VALIDATE_SCHEMA = z
	.string()
	.min(8, { message: 'Пароль должен содержать минимум 8 символов' })
	.regex(/[A-Z]/, {
		message: 'Пароль должен содержать хотя бы одну заглавную букву'
	})
	.regex(/[a-z]/, {
		message: 'Пароль должен содержать хотя бы одну строчную букву'
	})
	.regex(/[0-9]/, { message: 'Пароль должен содержать хотя бы одну цифру' })
	.regex(/[@$!%*?&]/, {
		message: 'Пароль должен содержать хотя бы один специальный символ (@$!%*?&)'
	})

export const PHONE_VALIDATE_SCHEMA = z
	.string()
	.min(1, { message: 'Номер телефона обязателен' })
	.regex(/^\+?\d{10,15}$/, {
		message:
			'Неверный формат номера телефона. Введите от 10 до 15 цифр, с опциональным "+" в начале'
	})
