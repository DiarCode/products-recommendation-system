import {
	ChartColumnIncreasing,
	Factory,
	ListFilter,
	MonitorCog,
	Package,
	Settings,
	ShoppingCart
} from 'lucide-react'

import { PageDetails } from '../pages.config'

export const ADMIN_PAGES = {
	ADMIN_DASHBOARD: {
		href: '/admin/dashboard',
		label: 'Аналитика',
		icon: ChartColumnIncreasing
	},
	ADMIN_STORE_CONFIG: {
		href: '/admin/config',
		label: 'Конфигурация',
		icon: MonitorCog
	},
	ADMIN_ORDERS: {
		href: '/admin/orders',
		label: 'Заказы',
		icon: ShoppingCart,
		children: {
			ADMIN_ORDER_DETAILS: {
				href: '/admin/orders/[id]',
				label: 'Детали заказа',
				icon: ShoppingCart
			}
		}
	},
	ADMIN_PRODUCTS: {
		href: '/admin/products',
		label: 'Товары',
		icon: Package,
		children: {
			ADMIN_PRODUCT_DETAILS: {
				href: '/admin/products/[id]',
				label: 'Детали товара',
				icon: Package
			}
		}
	},
	ADMIN_CATEGORIES: {
		href: '/admin/categories',
		label: 'Категории',
		icon: ListFilter
	},
	ADMIN_SETTINGS: {
		href: '/admin/settings',
		label: 'Настройки',
		icon: Settings
	},
	ADMIN_BRANDS: {
		href: '/admin/brands',
		label: 'Бренды',
		icon: Factory
	}
} satisfies Record<string, PageDetails>
