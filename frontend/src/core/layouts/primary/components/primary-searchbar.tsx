'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { Search } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

export const PrimarySearchBar = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const searchParams = useSearchParams()
	const router = useRouter()

	const onChangeSearchValue = useCallback((v: string) => {
		setSearchValue(v)
	}, [])

	useEffect(() => {
		onChangeSearchValue(searchParams.get('search') ?? '')
	}, [onChangeSearchValue, searchParams])

	const onSearchClick = useCallback(() => {
		router.push(`/products/?search=${searchValue}`)
	}, [router, searchValue])

	const handleFormSubmit = useCallback(
		(event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			onSearchClick()
		},
		[onSearchClick]
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
					placeholder='Найти на GGNet'
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
