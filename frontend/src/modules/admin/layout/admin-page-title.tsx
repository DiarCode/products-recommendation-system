'use client'

import { usePathname } from 'next/navigation'

import { PageKey, getPage } from '@/core/config/pages.config'

export const AdminPageTitle = () => {
	const pathname = usePathname()

	const getCurrentPage = () => {
		const pathSegments = pathname.split('/').filter(Boolean)

		if (pathname === '/admin') {
			return getPage('ADMIN_DASHBOARD')?.label || 'Страница'
		}

		for (let i = pathSegments.length; i > 0; i--) {
			const segments = pathSegments.slice(0, i)
			const dynamicPath = segments.join('/')
			const pageKey =
				`ADMIN_${segments[segments.length - 1].toUpperCase()}` as PageKey

			let page = getPage(pageKey)
			if (page) {
				return page.label
			}

			const dynamicPageKey =
				`ADMIN_${segments[segments.length - 1].toUpperCase()}_DETAILS` as PageKey
			const dynamicPage = getPage(dynamicPageKey)
			if (dynamicPage) {
				const dynamicRegex = dynamicPage.href.replace(/\[.*?\]/g, '([^/]+)')
				const regex = new RegExp(`^${dynamicRegex}$`)
				if (regex.test(dynamicPath)) {
					return dynamicPage.label
				}
			}
		}

		return 'Страница'
	}

	const currentPageTitle = getCurrentPage()

	return <h1 className='text-xl font-bold'>{currentPageTitle}</h1>
}
