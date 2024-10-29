'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useQueryClient } from '@tanstack/react-query'
import { LogOut, MoonIcon, Store, SunIcon, UserIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { getPage } from '@/core/config/pages.config'
import { CURRENT_USER_QUERY_KEY } from '@/modules/auth/hooks/user-current-user.hook'
import { authService } from '@/modules/auth/services/auth.service'
import { User } from '@/modules/users/models/users.types'
import {
	getUserFullName,
	getUserInitials
} from '@/modules/users/utils/users-format.utils'

interface AdminProfileMenuProps {
	user: User | null
}

export const AdminProfileMenu = ({ user }: AdminProfileMenuProps) => {
	const { resolvedTheme, setTheme } = useTheme()
	const queryClient = useQueryClient()
	const router = useRouter()

	const onLogoutClick = async () => {
		await authService.logout()
		queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
		router.push('/')
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='outline'
					size='icon'
					className='flex-shrink-0 overflow-hidden rounded-full'
				>
					<Avatar>
						<AvatarImage
							src='/image'
							alt={user ? getUserFullName(user) : 'НН'}
						/>
						<AvatarFallback>
							{user ? getUserInitials(user) : 'HH'}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuItem>
					<Link
						href={getPage('PROFILE_ORDERS').href}
						className='flex h-full w-full items-center gap-3'
					>
						<UserIcon className='h-4 w-4' />
						Мой профиль
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link
						href='/'
						className='flex h-full w-full items-center gap-3'
					>
						<Store className='h-4 w-4' />
						Магазин
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
							<div className='flex items-center gap-3'>
								<SunIcon className='h-4 w-4' />
								Светлая тема
							</div>
						) : (
							<div className='flex items-center gap-3'>
								<MoonIcon className='h-4 w-4' />
								Темная тема
							</div>
						)}
					</button>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					className='cursor-pointer'
					onClick={onLogoutClick}
				>
					<LogOut className='mr-3 h-4 w-4' />
					Выйти
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
