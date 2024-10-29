import { cookies } from 'next/headers'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

import { getQueryClient } from '@/core/api/query-client'
import { AdminMobileSidebar } from '@/modules/admin/layout/admin-mobile-sidebar'
import { AdminPageTitle } from '@/modules/admin/layout/admin-page-title'
import { AdminProfileMenu } from '@/modules/admin/layout/admin-profile-menu'
import { AdminSearch } from '@/modules/admin/layout/admin-search'
import { AdminSidebar } from '@/modules/admin/layout/admin-sidebar'
import { CURRENT_USER_QUERY_KEY } from '@/modules/auth/hooks/user-current-user.hook'
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { authService } from '@/modules/auth/services/auth.service'

interface AdminLayoutProps extends PropsWithChildren {}

export default async function AdminLayout({ children }: AdminLayoutProps) {
	const queryClient = getQueryClient()
	const token = cookies().get(Tokens.ACCESS)?.value

	const user = await authService.getCurrentWithToken(token)

	queryClient.prefetchQuery({
		queryKey: [CURRENT_USER_QUERY_KEY],
		queryFn: () => authService.getCurrentWithToken(token),
		initialData: user
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='relative flex h-screen w-full bg-muted/40'>
				<AdminSidebar />

				<div className='flex flex-1 flex-col overflow-y-auto sm:py-4'>
					<header className='sticky top-0 z-30 flex w-full items-center justify-between gap-4 border-b bg-background px-4 py-2 sm:static sm:border-0 sm:bg-transparent'>
						<div className='flex items-center gap-3'>
							<AdminMobileSidebar />
							<AdminPageTitle />
						</div>

						<div className='flex items-center gap-2'>
							<AdminSearch />
							<AdminProfileMenu user={user} />
						</div>
					</header>

					<main className='mt-2 p-4'>{children}</main>
				</div>
			</div>
		</HydrationBoundary>
	)
}
