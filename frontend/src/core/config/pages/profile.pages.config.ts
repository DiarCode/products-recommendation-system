import { User } from 'lucide-react'

import { PageDetails } from '../pages.config'

export const PROFILE_PAGES = {
	PROFILE_ORDERS: {
		href: '/profile/orders',
		label: 'Мои заказы',
		icon: User
	},
	PROFILE_PRODUCTS: {
		href: '/profile/products',
		label: 'Купленные товары',
		icon: User
	},
	PROFILE_ADDRESSES: {
		href: '/profile/addresses',
		label: 'Мои адреса',
		icon: User
	},
	PROFILE_REVIEWS: {
		href: '/profile/reviews',
		label: 'Мои отзывы',
		icon: User
	},

	PROFILE_SETTINGS: {
		href: '/profile/settings',
		label: 'Моя учетная запись',
		icon: User
	}
} satisfies Record<string, PageDetails>
