import { Metadata } from 'next'

import { FavoritesList } from '@/modules/favorites/components/favorites-list'

export const metadata: Metadata = {
	title: 'Избранное'
}

export default async function FavoritesPage() {
	return (
		<div>
			<h1 className='text-2xl font-bold'>Избранное</h1>

			<div className='mt-6'>
				<FavoritesList />
			</div>
		</div>
	)
}
