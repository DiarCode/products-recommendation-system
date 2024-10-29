'use client'

import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import { useTheme } from 'next-themes'

import { Button } from './ui/button'

type VariantTypes = 'outline' | 'default' | null

interface ThemeToggleProps {
	variant?: VariantTypes
}

export function ThemeToggle({ variant }: ThemeToggleProps) {
	const { resolvedTheme, setTheme } = useTheme()

	return (
		<Button
			variant={variant}
			size='icon'
			onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
		>
			{resolvedTheme === 'dark' ? (
				<SunIcon className='h-5 w-5' />
			) : (
				<MoonIcon className='h-5 w-5' />
			)}
		</Button>
	)
}
