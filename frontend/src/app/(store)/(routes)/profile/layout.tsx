import { cookies } from 'next/headers'
import Link from 'next/link'

import { Menu } from 'lucide-react'
import { PropsWithChildren } from 'react'

import { Button } from '@/core/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/core/components/ui/sheet'
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { authService } from '@/modules/auth/services/auth.service'
import { ProfileHeader } from '@/modules/profile/layout/profile-header'
import { ProfileMobileSidebar } from '@/modules/profile/layout/profile-sidebar'

interface ProfileLayoutProps extends PropsWithChildren {}

export default async function ProfileLayout({ children }: ProfileLayoutProps) {
	const token = cookies().get(Tokens.ACCESS)?.value
	const currentUser = await authService.getCurrentWithToken(token)

	if (!currentUser) {
		return (
			<div className='mt-12 flex justify-center'>
				<div className='max-w-sm'>
					<h1 className='text-center text-2xl font-bold'>
						Вы не вошли в аккаунт
					</h1>
					<h2 className='mt-4 text-center'>
						Чтобы просмотреть профиль, войдите в аккаунт или создайте новый. Вы
						также можете вернуться на главную и продолжить выбор товаров.
					</h2>
					<div className='mt-8 flex justify-center'>
						<Link href='/'>
							<Button>Перейти на главную</Button>
						</Link>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='grid min-h-screen w-full md:mt-4 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
			<ProfileHeader />

			<div className='flex flex-col'>
				<header className='block rounded-md bg-muted px-4 py-2 md:hidden md:rounded-none md:bg-transparent md:p-0'>
					<Sheet>
						<SheetTrigger asChild>
							<div className='flex items-center gap-4'>
								<Button
									variant='ghost'
									size='icon'
									className='shrink-0 md:hidden'
								>
									<Menu className='h-7 w-7' />
									<span className='sr-only'>Toggle navigation menu</span>
								</Button>

								<p className='inline-block text-lg font-medium md:hidden'>
									Профиль
								</p>
							</div>
						</SheetTrigger>
						<SheetContent
							side='left'
							className='flex flex-col'
						>
							<ProfileMobileSidebar />
						</SheetContent>
					</Sheet>
				</header>

				<main className='flex flex-1 flex-col gap-4 pt-4 md:p-0'>
					{children}
				</main>
			</div>
		</div>
	)
}
