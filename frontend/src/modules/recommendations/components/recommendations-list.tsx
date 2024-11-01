'use client'

import React, { Suspense } from 'react'

import { useMyRecommendations } from '../hooks/use-my-recommendations.hook'

import { useCurrentUser } from '@/modules/auth/hooks/user-current-user.hook'
import { ProductsList } from '@/modules/products/components/products-list'

export const RecommendationsList = () => {
	const { data: recommendations } = useMyRecommendations()
	const { data: currentUser } = useCurrentUser()

	return (
		<Suspense>
			{currentUser && recommendations?.length > 0 && (
				<div>
					<h3 className='mb-6 text-lg font-medium'>Вам может понравиться</h3>
					<ProductsList products={recommendations} />
				</div>
			)}
		</Suspense>
	)
}
