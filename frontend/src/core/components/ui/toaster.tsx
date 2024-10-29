'use client'

import { useTheme } from 'next-themes'
import { Toaster as ToasterSonner } from 'sonner'

export function Toaster() {
	const { resolvedTheme } = useTheme()

	return (
		<ToasterSonner
			position='top-center'
			theme={resolvedTheme == 'dark' ? 'dark' : 'light'}
			richColors
			duration={5000}
		/>
	)
}
