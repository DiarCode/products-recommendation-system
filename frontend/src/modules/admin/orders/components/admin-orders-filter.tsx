'use client'

import { useRouter, useSearchParams } from 'next/navigation'

import { PropsWithChildren, memo, useCallback } from 'react'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/core/components/ui/accordion'
import { Badge } from '@/core/components/ui/badge'
import { Checkbox } from '@/core/components/ui/checkbox'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/core/components/ui/sheet'
import { cn } from '@/core/lib/tailwind.utils'
import { OrderFilterStatus } from '@/modules/orders/models/orders.types'

const STATUSES = [
	{ value: OrderFilterStatus.ALL, label: 'Все' },
	{ value: OrderFilterStatus.ACTIVE, label: 'Активные' },
	{ value: OrderFilterStatus.PENDING, label: 'Ожидает подтверждения' },
	{ value: OrderFilterStatus.CONFIRMED, label: 'Подтвержден' },
	{ value: OrderFilterStatus.SHIPPED, label: 'Прибыл' },
	{ value: OrderFilterStatus.DELIVERED, label: 'Доставлен' },
	{ value: OrderFilterStatus.CANCELED, label: 'Отменен' }
]

const PAID = [
	{ value: 'true', label: 'Оплачен' },
	{ value: 'false', label: 'Не оплачен' }
]

interface AdminOrdersFilterProps extends PropsWithChildren {
	filter?: {
		status?: string
		isPaid?: string
	}
}

export const AdminOrdersFilter = ({
	filter = {},
	children
}: AdminOrdersFilterProps) => {
	const { status: selectedStatus, isPaid } = filter
	const router = useRouter()
	const searchParams = useSearchParams()

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
					<CollapsibleFilter label='Статус'>
						<div className='flex flex-col gap-3'>
							{STATUSES.map(status => (
								<button
									key={status.value}
									onClick={() => handleFilterChange('status', status.value)}
									className='flex w-full cursor-pointer items-center gap-4'
								>
									<Checkbox
										id={status.value}
										checked={status.value === selectedStatus}
										className='h-5 w-5 rounded-md border-gray-300'
									/>
									<label
										htmlFor={status.value}
										className='cursor-pointer text-sm font-normal'
									>
										{status.label}
									</label>
								</button>
							))}
						</div>
					</CollapsibleFilter>

					<CollapsibleFilter label='Оплата'>
						<div className='flex flex-col gap-3'>
							{PAID.map(paid => (
								<button
									key={paid.value}
									onClick={() => handleFilterChange('isPaid', paid.value)}
									className='flex w-full cursor-pointer items-center gap-4'
								>
									<Checkbox
										id={paid.value}
										checked={paid.value === isPaid}
										className='h-5 w-5 rounded-md border-gray-300'
									/>
									<label
										htmlFor={paid.value}
										className='cursor-pointer text-sm font-normal'
									>
										{paid.label}
									</label>
								</button>
							))}
						</div>
					</CollapsibleFilter>
				</div>
			</SheetContent>
		</Sheet>
	)
}

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
