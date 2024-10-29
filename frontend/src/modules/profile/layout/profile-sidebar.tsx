'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { PropsWithChildren, useMemo } from 'react'

import { PageKey, getPage, isPageActive } from '@/core/config/pages.config'
import { cn } from '@/core/lib/tailwind.utils'

interface ProfileSidebarPages {
	menuLabel: string
	children: PageKey[]
}

const sidebarPages: ProfileSidebarPages[] = [
	{
		menuLabel: 'Личная информация',
		children: ['PROFILE_ADDRESSES', 'PROFILE_REVIEWS', 'FAVORITE_PRODUCTS']
	},
	{
		menuLabel: 'Заказы',
		children: ['PROFILE_ORDERS', 'CART', 'PROFILE_PRODUCTS']
	},
	{
		menuLabel: 'Настройки аккаунта',
		children: ['PROFILE_SETTINGS']
	}
]

const RenderedSidebarMenus = () => {
	const pathname = usePathname()

	const optimizedPages = useMemo(
		() =>
			sidebarPages.map(menu => ({
				...menu,
				pages: menu.children.map(page => getPage(page))
			})),
		[]
	)

	return optimizedPages.map(menu => (
		<DesktopLayoutMenu
			key={menu.menuLabel}
			label={menu.menuLabel}
		>
			{menu.pages.map(page => (
				<DesktopLayoutLink
					key={page.href}
					label={page.label}
					href={page.href}
					isActive={isPageActive(page.href, pathname)}
				/>
			))}
		</DesktopLayoutMenu>
	))
}

interface ProfileDesktopSidebarProps {
	className?: string
}

export const ProfileDesktopSidebar = ({
	className
}: ProfileDesktopSidebarProps) => {
	return (
		<nav className={cn('grid items-start gap-6', className)}>
			<RenderedSidebarMenus />
		</nav>
	)
}

export const ProfileMobileSidebar = () => {
	return (
		<nav className='grid items-start gap-6 !text-lg'>
			<RenderedSidebarMenus />
		</nav>
	)
}

interface DesktopLayoutMenuProps extends PropsWithChildren {
	label: string
}

const DesktopLayoutMenu = ({ label, children }: DesktopLayoutMenuProps) => {
	return (
		<div className='flex flex-col gap-3'>
			<p className='font-bold'>{label}</p>
			{children}
		</div>
	)
}

interface DesktopLayoutLinkProps {
	label: string
	href: string
	isActive?: boolean
}

const DesktopLayoutLink = ({
	label,
	href,
	isActive
}: DesktopLayoutLinkProps) => {
	return (
		<Link
			href={href}
			className={cn('', isActive ? 'text-primary' : 'text-foreground')}
		>
			{label}
		</Link>
	)
}
