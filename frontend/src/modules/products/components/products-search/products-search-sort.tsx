'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { ArrowDownUp } from 'lucide-react'

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@/core/components/ui/select'

const sorts = [
	{ value: 'createdAt:DESC', label: 'Новинки' },
	{ value: 'price:ASC', label: 'Дешевле' },
	{ value: 'price:DESC', label: 'Дороже' }
]

export function ProductsSearchSort({ selectedSort }: { selectedSort: string }) {
	const router = useRouter()
	const searchParams = useSearchParams()

	const handleSortChange = (sort: string) => {
		const params = new URLSearchParams(searchParams.toString())

		params.set('sortBy', sort)

		router.push(`?${params.toString()}`)
	}

	return (
		<Select
			value={selectedSort}
			onValueChange={handleSortChange}
		>
			<SelectTrigger
				className='w-fit gap-2 border-none shadow-none hover:bg-accent hover:text-accent-foreground'
				includeArrow={false}
			>
				<ArrowDownUp className='h-4 w-4' />
				<SelectValue placeholder='Сортировка' />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					{sorts.map(sort => (
						<SelectItem
							key={sort.value}
							value={sort.value}
						>
							{sort.label}
						</SelectItem>
					))}
				</SelectGroup>
			</SelectContent>
		</Select>
	)
}
