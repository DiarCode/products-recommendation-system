'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { useMutation } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { Suspense, useCallback, useEffect, useState } from 'react'

import { useCurrentUser } from '@/modules/auth/hooks/user-current-user.hook'
import { productsService } from '@/modules/products/services/products.service'

export const PrimarySearchBar = () => {
	const searchParams = useSearchParams()
	const [searchValue, setSearchValue] = useState<string>(
		searchParams.get('search') ?? ''
	)
	const router = useRouter()

	const mutation = useMutation({
		mutationFn: (term: string) => productsService.saveSearchTerms(term)
	})

	const onChangeSearchValue = useCallback((v: string) => {
		setSearchValue(v)
	}, [])

	const onSearchClick = useCallback(() => {
		router.push(`/products/?search=${searchValue}`)
	}, [router, searchValue])

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			mutation.mutate(searchValue)
			onSearchClick()
		},
		[mutation, onSearchClick, searchValue]
	)

	return (
		<form
			onSubmit={handleFormSubmit}
			className='flex w-full justify-end'
		>
			<div className='relative w-full max-w-[450px]'>
				<input
					type='text'
					className='w-full rounded-xl border border-primary bg-background px-4 py-2 focus:border-primary'
					placeholder='Найти на Tekno'
					value={searchValue}
					onChange={e => onChangeSearchValue(e.target.value)}
				/>

				<button
					type='submit'
					className='absolute right-4 top-2 cursor-pointer text-primary'
					onClick={onSearchClick}
					disabled={!searchValue.length}
				>
					<Search size={20} />
				</button>
			</div>
		</form>
	)
}
