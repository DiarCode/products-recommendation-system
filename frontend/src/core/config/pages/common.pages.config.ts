import { Factory, Filter, Heart, Package } from 'lucide-react'

import { PageDetails } from '../pages.config'

export const COMMON_PAGES = {
	FAVORITE_PRODUCTS: {
		href: '/favorites',
		label: 'Избранное',
		icon: Heart
	},
	CART: {
		href: '/cart',
		label: 'Корзина',
		icon: Heart
	},
	PRODUCTS: {
		href: '/products',
		label: 'Товары',
		icon: Package
	},
	CATEGORIES: {
		href: '/categories',
		label: 'Каталог',
		icon: Filter
	},
	BRANDS: {
		href: '/brands',
		label: 'Бренды',
		icon: Factory
	}
} satisfies Record<string, PageDetails>
