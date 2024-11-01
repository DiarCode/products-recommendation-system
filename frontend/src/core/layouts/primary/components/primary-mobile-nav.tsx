'use client'

import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'

import { Menu } from 'lucide-react'

import { Button } from '@/core/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/core/components/ui/sheet'
import { cn } from '@/core/lib/tailwind.utils'

export function PrimaryMobileNav() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					size='icon'
					variant='ghost'
					className='md:hidden'
				>
					<Menu className='h-7 w-7' />
					<span className='sr-only'>Toggle Menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent
				side='left'
				className='sm:max-w-xs'
			>
				<nav className='grid gap-6 text-lg font-medium'>
					<Link
						href='/'
						className='text-2xl font-bold'
					>
						Tekno
					</Link>
					<Link
						href='/'
						className='text-muted-foreground hover:text-foreground'
					>
						Главная
					</Link>
					<Link
						href='/categories'
						className='text-muted-foreground hover:text-foreground'
					>
						Каталог
					</Link>
					<Link
						href='/brands'
						className='text-muted-foreground hover:text-foreground'
					>
						Каталог
					</Link>
					<Link
						href='/products'
						className='text-muted-foreground hover:text-foreground'
					>
						Поиск
					</Link>
				</nav>
			</SheetContent>
		</Sheet>
	)
}

interface MobileLinkProps extends LinkProps {
	onOpenChange?: (open: boolean) => void
	children: React.ReactNode
	className?: string
}

function MobileLink({
	href,
	onOpenChange,
	className,
	children,
	...props
}: MobileLinkProps) {
	const router = useRouter()
	return (
		<Link
			href={href}
			onClick={() => {
				router.push(href.toString())
				onOpenChange?.(false)
			}}
			className={cn(className)}
			{...props}
		>
			{children}
		</Link>
	)
}
