import { LucideIcon } from 'lucide-react'

import { ADMIN_PAGES } from './pages/admin.pages.config'
import { AUTH_PAGES } from './pages/auth.pages.config'
import { COMMON_PAGES } from './pages/common.pages.config'
import { PROFILE_PAGES } from './pages/profile.pages.config'

interface RouteParams {
	[key: string]: string
}

export interface PageDetails {
	href: string
	label: string
	params?: RouteParams
	icon?: LucideIcon
	children?: Record<string, PageDetails>
}

const PAGES = {
	...ADMIN_PAGES,
	...AUTH_PAGES,
	...PROFILE_PAGES,
	...COMMON_PAGES
}

export type PageKey = keyof typeof PAGES

export const getPage = (pageKey: PageKey) => {
	return PAGES[pageKey]
}

export const isPageActive = (pageHref: string, pathname: string): boolean => {
	if (pathname === pageHref) {
		return true
	}

	const dynamicRegex = pageHref.replace(/\[.*?\]/g, '([^/]+)')
	const regex = new RegExp(`^${dynamicRegex}`)

	return regex.test(pathname)
}
