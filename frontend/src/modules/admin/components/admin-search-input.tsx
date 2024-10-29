'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import debounce from 'lodash.debounce'
import { Search } from 'lucide-react'
import { ChangeEvent, useState } from 'react'

import { Input } from '@/core/components/ui/input'

interface AdminSearchInputProps {
	search?: string
}

export const AdminSearchInput = ({ search }: AdminSearchInputProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const [searchTerm, setSearchTerm] = useState<string>(search || '')

	const updateSearchQuery = debounce((value: string) => {
		const params = new URLSearchParams(searchParams.toString())
		if (value.trim()) {
			params.set('search', value)
		} else {
			params.delete('search')
		}
		const newQueryString = params.toString()
		router.push(`${pathname}?${newQueryString}`)
	}, 300)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setSearchTerm(value)
		updateSearchQuery(value)
	}

	return (
		<div className='relative flex-1 md:grow-0'>
			<Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
			<Input
				type='search'
				placeholder='Поиск...'
				value={searchTerm}
				onChange={handleChange}
				className='w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]'
			/>
		</div>
	)
}
