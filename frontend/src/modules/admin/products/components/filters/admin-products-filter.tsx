'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import debounce from 'lodash.debounce'
import { PropsWithChildren, Suspense, memo, useCallback, useState } from 'react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/core/components/ui/accordion'
import { Badge } from '@/core/components/ui/badge'
import { Checkbox } from '@/core/components/ui/checkbox'
import { Input } from '@/core/components/ui/input'
import { ScrollArea } from '@/core/components/ui/scroll-area'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/core/components/ui/sheet'
import { Skeleton } from '@/core/components/ui/skeleton'
import { cn } from '@/core/lib/tailwind.utils'
import { useBrands } from '@/modules/brands/hooks/use-brands.hook'
import { useCategories } from '@/modules/categories/hooks/use-categories'

const DEFAULT_SCROLLABLE_LENGTH = 8

interface AdminProductsSearchFilterProps extends PropsWithChildren {
	filter?: {
		subCategoryId?: string
		brandCategoryId?: string
	}
}

export const AdminProductsSearchFilter = ({
	filter = {},
	children
}: AdminProductsSearchFilterProps) => {
	const {
		subCategoryId: selectedSubCategoryId,
		brandCategoryId: selectedBrandCategoryId
	} = filter

	const router = useRouter()
	const searchParams = useSearchParams()

	const [categorySearch, setCategorySearch] = useState('')
	const [brandSearch, setBrandSearch] = useState('')

	const { data: categories } = useCategories({ search: categorySearch })
	const { data: brands } = useBrands({ search: brandSearch })

	const handleCategorySearch = debounce(
		(value: string) => setCategorySearch(value),
		500
	)
	const handleBrandSearch = debounce(
		(value: string) => setBrandSearch(value),
		500
	)

	const filledFiltersCount = Object.values(filter).filter(Boolean).length

	const handleFilterChange = useCallback(
		(key: string, id: string) => {
			const params = new URLSearchParams(searchParams.toString())
			const isSelected = params.get(key) === id
			isSelected ? params.delete(key) : params.set(key, id)
			params.delete('search')
			router.push(`?${params.toString()}`)
		},
		[router, searchParams]
	)

	return (
		<Sheet>
			<SheetTrigger asChild>
				<div className='relative'>
					{children}
					{filledFiltersCount > 0 && (
						<Badge
							className='absolute -right-1 -top-1 h-4 p-[6px] text-[10px]'
							variant='destructive'
						>
							{filledFiltersCount}
						</Badge>
					)}
				</div>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle className='text-2xl font-bold'>Фильтры</SheetTitle>
				</SheetHeader>
				<div className='mt-2 flex flex-col gap-4'>
					<CollapsibleFilter label='Категория'>
						<Input
							type='search'
							placeholder='Я ищу...'
							className='bg-muted focus:bg-transparent'
							onChange={e => handleCategorySearch(e.target.value)} // Debounced search handler
						/>
						<Suspense
							fallback={<Skeleton className='h-10 w-full rounded-xl' />}
						>
							<ScrollArea
								className={cn(
									'mt-2 flex h-fit w-full flex-col gap-3',
									categories?.length > DEFAULT_SCROLLABLE_LENGTH && 'h-64'
								)}
							>
								{categories?.map(category => (
									<GenericSelectListItem
										key={category.id}
										parentItem={{
											id: category.id,
											name: category.name,
											children: category.subCategories
										}}
										selectedChildId={selectedSubCategoryId}
										onChildClick={id => handleFilterChange('subCategoryId', id)}
										renderParentName={parent => parent.name}
										renderChildName={child => child.name}
									/>
								))}
							</ScrollArea>
						</Suspense>
					</CollapsibleFilter>

					<CollapsibleFilter label='Бренды'>
						<Input
							type='search'
							placeholder='Я ищу...'
							className='bg-muted focus:bg-transparent'
							onChange={e => handleBrandSearch(e.target.value)}
						/>
						<Suspense
							fallback={<Skeleton className='h-10 w-full rounded-xl' />}
						>
							<ScrollArea
								className={cn(
									'mt-2 flex h-fit w-full flex-col gap-3',
									brands?.length > DEFAULT_SCROLLABLE_LENGTH && 'h-64'
								)}
							>
								{brands?.map(brand => (
									<GenericSelectListItem
										key={brand.id}
										parentItem={{
											id: brand.id,
											name: brand.name,
											children: brand.brandCategories
										}}
										selectedChildId={selectedBrandCategoryId}
										onChildClick={id =>
											handleFilterChange('brandCategoryId', id)
										}
										renderParentName={parent => parent.name}
										renderChildName={child => child.name}
									/>
								))}
							</ScrollArea>
						</Suspense>
					</CollapsibleFilter>
				</div>
			</SheetContent>
		</Sheet>
	)
}

interface ParentWithChildren<T> {
	id: string
	name: string
	children: T[]
}

interface GenericSelectListItemProps<T extends { id: string; name: string }> {
	parentItem: ParentWithChildren<T>
	selectedChildId?: string
	onChildClick: (id: string) => void
	renderParentName: (parent: ParentWithChildren<T>) => React.ReactNode
	renderChildName: (child: T) => React.ReactNode
}

const GenericSelectListItem = <T extends { id: string; name: string }>({
	parentItem,
	selectedChildId,
	onChildClick,
	renderParentName,
	renderChildName
}: GenericSelectListItemProps<T>) => {
	const isParentOpen = parentItem.children.some(
		child => child.id === selectedChildId
	)

	return (
		<Accordion
			type='single'
			collapsible
			defaultValue={isParentOpen ? parentItem.id : ''}
		>
			<AccordionItem
				value={parentItem.id}
				className='border-none'
			>
				<AccordionTrigger className='text-sm hover:no-underline'>
					{renderParentName(parentItem)}
				</AccordionTrigger>
				<AccordionContent className='flex flex-col gap-2 px-2'>
					{parentItem.children.map(child => (
						<button
							key={child.id}
							onClick={() => onChildClick(child.id)}
							className='flex w-full cursor-pointer items-center gap-4'
						>
							<Checkbox
								id={child.id}
								checked={selectedChildId === child.id}
								className='h-5 w-5 rounded-md border-gray-300'
							/>
							<label
								htmlFor={child.id}
								className='cursor-pointer text-sm font-normal'
							>
								{renderChildName(child)}
							</label>
						</button>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}

GenericSelectListItem.displayName = 'GenericSelectListItem'

interface CollapsibleFilterProps extends PropsWithChildren {
	label: string
	className?: string
}

const CollapsibleFilter = memo(
	({ label, children, className }: CollapsibleFilterProps) => (
		<Accordion
			type='single'
			collapsible
			defaultValue='item-1'
			className={cn(className)}
		>
			<AccordionItem
				value='item-1'
				className='border-none'
			>
				<AccordionTrigger className='text-base font-semibold hover:no-underline'>
					{label}
				</AccordionTrigger>
				<AccordionContent className='p-[1px]'>{children}</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
)

CollapsibleFilter.displayName = 'CollapsibleFilter'
