'use client'

import Link from 'next/link'

import { LogIn, MoonIcon, SunIcon, User as UserIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'

export const LoginNavigation = () => {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
				>
					<UserIcon className='h-6 w-6' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem>
					<Link
						href='/login'
						className='flex items-center gap-2'
					>
						<LogIn className='h-4 w-4' />
						Войти
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />

				<DropdownMenuItem>
					<button
						className='h-full w-full'
						onClick={() =>
							setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
						}
					>
						{resolvedTheme === 'dark' ? (
							<div className='flex items-center gap-2'>
								<SunIcon className='h-4 w-4' />
								Светлая тема
							</div>
						) : (
							<div className='flex items-center gap-2'>
								<MoonIcon className='h-4 w-4' />
								Темная тема
							</div>
						)}
					</button>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
