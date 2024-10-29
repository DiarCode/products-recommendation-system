'use client'

import Link from 'next/link'

import { LucideIcon } from 'lucide-react'
import { Suspense } from 'react'

import { CartNavigation } from './components/navigations/cart-navigation'
import { FavoritesNavigation } from './components/navigations/favorites-navigation'
import { LoginNavigation } from './components/navigations/login-navigation'
import { UserNavigation } from './components/navigations/user-navigation'
import { PrimaryMainNav } from './components/primary-main-nav'
import { PrimaryMobileNav } from './components/primary-mobile-nav'
import { PrimarySearchBar } from './components/primary-searchbar'
import { Button } from '@/core/components/ui/button'
import { Skeleton } from '@/core/components/ui/skeleton'
import { useCurrentUser } from '@/modules/auth/hooks/user-current-user.hook'

export function PrimaryHeader() {
	const { data: user } = useCurrentUser()

	return (
		<header className='sticky top-0 z-50 w-full bg-background'>
			<div className='flex items-center gap-x-4 py-5'>
				<PrimaryMainNav />
				<PrimaryMobileNav />
				<div className='flex flex-1 items-center justify-end gap-3'>
					<PrimarySearchBar />
					<Suspense fallback={<Skeleton className='h-6 w-6 rounded-full' />}>
						<FavoritesNavigation />
						<CartNavigation />
						{user ? <UserNavigation user={user} /> : <LoginNavigation />}
					</Suspense>
				</div>
			</div>
		</header>
	)
}

interface NavLinkProps {
	href: string
	label: string
	icon: LucideIcon
}

export const NavLink = (props: NavLinkProps) => {
	return (
		<Link href={props.href}>
			<Button
				variant='ghost'
				size='icon'
				className='h-8 w-8 p-0 hover:text-primary'
			>
				<props.icon
					className='h-6 w-6'
					strokeWidth={1.8}
				/>
			</Button>
		</Link>
	)
}
