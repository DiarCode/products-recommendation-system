'use client'

import { TooltipProvider } from '@radix-ui/react-tooltip'
import { QueryClientProvider } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'

import { getQueryClient } from '@/core/api/query-client'
import { Toaster } from '@/core/components/ui/toaster'
import { ThemeProvider } from '@/core/providers/theme-provider'

interface ProvidersProps extends PropsWithChildren {}

export const Providers = ({ children }: ProvidersProps) => {
	const queryClient = getQueryClient()

	return (
		<ThemeProvider
			attribute='class'
			defaultTheme='system'
			enableSystem
		>
			<QueryClientProvider client={queryClient}>
				<TooltipProvider>
					{children}
					<Toaster />
				</TooltipProvider>
			</QueryClientProvider>
		</ThemeProvider>
	)
}
