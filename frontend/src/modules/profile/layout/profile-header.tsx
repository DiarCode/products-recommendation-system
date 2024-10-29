'use client'

import { Suspense } from 'react'

import { ProfileDesktopSidebar } from './profile-sidebar'
import {
	Avatar,
	AvatarFallback,
	AvatarImage
} from '@/core/components/ui/avatar'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { useCurrentUser } from '@/modules/auth/hooks/user-current-user.hook'
import {
	getUserFullName,
	getUserInitials
} from '@/modules/users/utils/users-format.utils'

export const ProfileHeader = () => {
	const { data: currentUser } = useCurrentUser()

	return (
		<Suspense fallback='Загрузка...'>
			<div className='hidden md:block'>
				<div className='h-full max-h-screen'>
					<div>
						<Avatar className='h-24 w-24 bg-muted'>
							<AvatarImage
								src={getProductImageUrl(null)}
								alt='Avatar'
							/>
							<AvatarFallback className='text-2xl'>
								{currentUser ? getUserInitials(currentUser) : 'НН'}
							</AvatarFallback>
						</Avatar>

						<p className='mt-4 text-2xl font-bold'>
							{currentUser ? getUserFullName(currentUser) : 'НН'}
						</p>
					</div>

					<ProfileDesktopSidebar className='mt-6' />
				</div>
			</div>
		</Suspense>
	)
}
