'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ArrowLeft, PanelLeft } from 'lucide-react'

import { Button } from '@/core/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/core/components/ui/sheet'
import { PageKey, getPage, isPageActive } from '@/core/config/pages.config'
import { cn } from '@/core/lib/tailwind.utils'

const sidebarPageKeys: PageKey[] = [
	'ADMIN_DASHBOARD',
	'ADMIN_ORDERS',
	'ADMIN_PRODUCTS',
	'ADMIN_CATEGORIES',
	'ADMIN_BRANDS'
]

export const AdminMobileSidebar = () => {
	const pathname = usePathname()

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					size='icon'
					variant='outline'
					className='sm:hidden'
				>
					<PanelLeft className='h-5 w-5' />
					<span className='sr-only'>Открыть или свернуть</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side='left'
				className='sm:max-w-xs'
			>
				<nav className='grid gap-6 text-lg font-medium'>
					{sidebarPageKeys.map(pageKey => {
						const page = getPage(pageKey)
						const isActive = isPageActive(page.href, pathname)

						return (
							<Link
								key={page.href}
								href={page.href}
								className={cn(
									'flex items-center gap-4 px-2.5 text-muted-foreground',
									isActive && 'text-primary'
								)}
							>
								<page.icon className='h-5 w-5' />
								{page.label}
							</Link>
						)
					})}

					<Link
						href='/'
						className='flex items-center justify-center gap-4 rounded-md bg-secondary px-4 py-2 text-secondary-foreground'
					>
						<ArrowLeft className='h-5 w-5' />
						<span>Вернуться в магазин</span>
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	)
}
