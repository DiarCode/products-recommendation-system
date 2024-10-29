'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
	CircleHelp,
	LucideIcon,
	PanelLeftClose,
	PanelRightClose,
	Store
} from 'lucide-react'
import { useState } from 'react'

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'
import { PageKey, getPage, isPageActive } from '@/core/config/pages.config'
import { cn } from '@/core/lib/tailwind.utils'

const sidebarPageKeys: PageKey[] = [
	'ADMIN_DASHBOARD',
	'ADMIN_STORE_CONFIG',
	'ADMIN_ORDERS',
	'ADMIN_PRODUCTS',
	'ADMIN_CATEGORIES',
	'ADMIN_BRANDS'
]

export const AdminSidebar = () => {
	const pathname = usePathname()
	const [isCollapsed, setIsCollapsed] = useState(true)

	const toggleSidebar = () => setIsCollapsed(prev => !prev)

	return (
		<aside
			className={cn(
				'relative hidden h-screen flex-col border-r bg-background py-5 transition-all duration-300 sm:flex',
				isCollapsed ? 'px-2' : 'px-6'
			)}
		>
			<div className='flex items-center justify-between gap-4'>
				{!isCollapsed && (
					<Link
						href='/'
						className='text-xl font-medium'
					>
						GGNet
					</Link>
				)}

				<button
					onClick={toggleSidebar}
					className={cn(
						'flex w-full items-center justify-center',
						isCollapsed ? 'w-full' : 'w-fit'
					)}
				>
					{isCollapsed ? (
						<PanelRightClose className='h-5 w-5' />
					) : (
						<PanelLeftClose className='h-5 w-5' />
					)}

					<span className='sr-only'>Toggle Sidebar</span>
				</button>
			</div>

			<nav className='mt-8 flex flex-col gap-5'>
				{sidebarPageKeys.map(pageKey => {
					const page = getPage(pageKey)
					const isActive = isPageActive(page.href, pathname)

					return (
						<AdminSidebarLink
							key={page.href}
							label={page.label}
							href={page.href}
							icon={page.icon}
							isActive={isActive}
							isCollapsed={isCollapsed}
						/>
					)
				})}
			</nav>

			<div className='mt-auto flex flex-col gap-4 px-2 py-4'>
				<Tooltip>
					<TooltipTrigger asChild>
						<Link
							href='/'
							className={cn(
								'flex items-center gap-3 rounded-md bg-secondary px-4 py-3 text-secondary-foreground transition-all',
								isCollapsed ? 'justify-center px-3 py-2' : 'justify-start'
							)}
						>
							<Store className='h-5 w-5' />
							{!isCollapsed && (
								<span className='font-medium'>Вернуться в магазин</span>
							)}
						</Link>
					</TooltipTrigger>
					{isCollapsed && (
						<TooltipContent side='right'>Вернуться в магазин</TooltipContent>
					)}
				</Tooltip>
			</div>
		</aside>
	)
}

interface AdminSidebarLinkProps {
	icon?: LucideIcon
	label: string
	href: string
	isActive?: boolean
	isCollapsed: boolean
}

const AdminSidebarLink = (item: AdminSidebarLinkProps) => {
	const { href, isCollapsed, isActive, label } = item
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link
					href={href}
					className={cn(
						'flex items-center gap-4 transition-all duration-300',
						isCollapsed ? 'justify-center' : 'w-full justify-start',
						isActive ? 'font-medium text-primary' : 'text-muted-foreground'
					)}
				>
					{item.icon ? (
						<item.icon className='h-5 w-5' />
					) : (
						<CircleHelp className='h-5 w-5' />
					)}
					{!isCollapsed && <span className='text-base'>{label}</span>}
				</Link>
			</TooltipTrigger>
			{isCollapsed && <TooltipContent side='right'>{label}</TooltipContent>}
		</Tooltip>
	)
}
