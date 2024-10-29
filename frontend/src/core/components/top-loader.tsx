import NextTopLoader from 'nextjs-toploader'
import React from 'react'

export function PageTopLoader() {
	return (
		<NextTopLoader
			color='#2563eb'
			height={4}
			showSpinner={false}
			easing='ease'
		/>
	)
}
