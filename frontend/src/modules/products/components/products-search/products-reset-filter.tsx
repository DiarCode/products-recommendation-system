'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { RotateCcw } from 'lucide-react'

import { Button } from '@/core/components/ui/button'

const RETAIN_PARAMS = ['sortBy', 'search']

export const ProductsResetFilters = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const handleResetFilters = () => {
		const params = new URLSearchParams(searchParams.toString())

		const newParams = new URLSearchParams()

		RETAIN_PARAMS.forEach(param => {
			const value = params.get(param)
			if (value !== null) {
				newParams.set(param, value)
			}
		})

		router.push(`?${newParams.toString()}`)
	}

	return (
		<Button
			type='button'
			variant='ghost'
			onClick={handleResetFilters}
			className='gap-2'
		>
			<RotateCcw className='h-4 w-4' />
			Сбросить
		</Button>
	)
}
