import { Heart } from 'lucide-react'

import { NavLink } from '../../primary-header'

export const FavoritesNavigation = () => {
	return (
		<NavLink
			href='/favorites'
			icon={Heart}
			label='Избранные'
		/>
	)
}
