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

	// Validate pageHref length to prevent excessive regex complexity
	if (pageHref.length > 100) {
		return false // Reject overly long patterns
	}

	// Escape special regex characters to prevent ReDoS
	const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

	// Only allow [param] style dynamic segments and ensure no other regex special characters
	if (!/^\[.*?\]$/.test(pageHref) && pageHref.includes('[')) {
		return false
	}

	const sanitizedPageHref = escapeRegExp(pageHref)
	const dynamicRegex = sanitizedPageHref.replace(/\[.*?\]/g, '([^/]+)')

	try {
		const regex = new RegExp(`^${dynamicRegex}$`) // Ensure strict match
		return regex.test(pathname)
	} catch (err) {
		return false // Fail-safe: Avoid crashing the app if regex is invalid
	}
}

