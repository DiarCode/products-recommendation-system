import { cookies } from 'next/headers'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

import { getQueryClient } from '@/core/api/query-client'
import { PrimaryFooter } from '@/core/layouts/primary/primary-footer'
import { PrimaryHeader } from '@/core/layouts/primary/primary-header'
import { CURRENT_USER_QUERY_KEY } from '@/modules/auth/hooks/user-current-user.hook'
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { authService } from '@/modules/auth/services/auth.service'

interface StoreLayout extends PropsWithChildren {}

export default async function StoreLayout({ children }: StoreLayout) {
	const queryClient = getQueryClient()
	const token = cookies().get(Tokens.ACCESS)?.value

	queryClient.prefetchQuery({
		queryKey: [CURRENT_USER_QUERY_KEY],
		queryFn: () => authService.getCurrentWithToken(token)
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<div className='h-screen w-full overflow-x-hidden'>
				<div className='mx-auto max-w-[1440px] px-4'>
					<PrimaryHeader />

					<main className='flex-1'>{children}</main>

					<PrimaryFooter />
				</div>
			</div>
		</HydrationBoundary>
	)
}
