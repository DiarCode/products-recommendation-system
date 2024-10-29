import { Inter } from 'next/font/google'

import type { Metadata } from 'next'

import './globals.css'
import { Providers } from './providers'
import { PageTopLoader } from '@/core/components/top-loader'
import {
	SEO_DESCRIPTION,
	SEO_KEYWORDS,
	SITE_NAME
} from '@/core/constants/seo.constants'

const inter = Inter({ subsets: ['latin'], preload: false })

export const metadata: Metadata = {
	title: {
		default: SITE_NAME,
		template: `%s | ${SITE_NAME}`
	},
	description: SEO_DESCRIPTION,
	keywords: SEO_KEYWORDS,
	openGraph: {
		title: SITE_NAME,
		description: SEO_DESCRIPTION,
		url: 'https://shop.ggnet.kz'
	},
	alternates: {
		canonical: 'https://shop.ggnet.kz'
	},
	icons: {
		icon: [
			{ url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
			{ url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
			{ url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
			{
				url: '/android-icon-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			}
		],
		apple: [
			{ url: '/apple-icon-57x57.png', sizes: '57x57' },
			{ url: '/apple-icon-60x60.png', sizes: '60x60' },
			{ url: '/apple-icon-72x72.png', sizes: '72x72' },
			{ url: '/apple-icon-76x76.png', sizes: '76x76' },
			{ url: '/apple-icon-114x114.png', sizes: '114x114' },
			{ url: '/apple-icon-120x120.png', sizes: '120x120' },
			{ url: '/apple-icon-144x144.png', sizes: '144x144' },
			{ url: '/apple-icon-152x152.png', sizes: '152x152' },
			{ url: '/apple-icon-180x180.png', sizes: '180x180' }
		]
	}
}

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html
			lang='ru'
			suppressHydrationWarning
		>
			<body className={inter.className}>
				<PageTopLoader />
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
