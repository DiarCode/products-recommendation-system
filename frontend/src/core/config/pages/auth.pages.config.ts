import { User } from 'lucide-react'

import { PageDetails } from '../pages.config'

export const AUTH_PAGES = {
	AUTH_LOGIN: {
		href: '/login',
		label: 'Войти в аккаунт',
		icon: User
	},
	AUTH_SIGNUP: {
		href: '/signup',
		label: 'Зарегистрировать аккаунт',
		icon: User
	}
} satisfies Record<string, PageDetails>
