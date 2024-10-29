import { LucideIcon, MoveDownRight, MoveUpRight } from 'lucide-react'
import { useMemo } from 'react'

import { Skeleton } from '@/core/components/ui/skeleton'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger
} from '@/core/components/ui/tooltip'

interface AdminSalesCardProps {
	title: string
	value: string
	changePercentage?: number
	changeRateDescription?: string
	icon?: LucideIcon
}

export const AdminAnalyticsCard = (item: AdminSalesCardProps) => {
	const renderedChangeRate = useMemo(() => {
		if (!item.changePercentage) return null

		if (item.changePercentage < 0) {
			return (
				<div className='flex w-fit items-center gap-1 rounded-full bg-red-200 px-2 py-1 text-xs text-red-950'>
					<MoveDownRight size={14} />
					<p>{item.changePercentage.toFixed(0)}%</p>
				</div>
			)
		}

		return (
			<div className='flex w-fit items-center gap-1 rounded-full bg-green-200 px-2 py-1 text-xs text-green-950'>
				<MoveUpRight size={14} />
				<p>{item.changePercentage}%</p>
			</div>
		)
	}, [item.changePercentage])

	return (
		<div className='relative h-full cursor-pointer rounded-2xl border bg-background p-6'>
			<div className='flex items-center gap-2'>
				{item.icon && (
					<item.icon
						size={18}
						className='text-primary'
					/>
				)}
				<Tooltip>
					<TooltipTrigger>
						<p className='truncate'>{item.title}</p>
					</TooltipTrigger>
					<TooltipContent>{item.title}</TooltipContent>
				</Tooltip>
			</div>

			<div className='mt-5 flex items-end gap-4'>
				<Tooltip>
					<TooltipTrigger>
						<p className='fond-medium truncate text-4xl'>{item.value}</p>
					</TooltipTrigger>
					<TooltipContent>{item.value}</TooltipContent>
				</Tooltip>
			</div>

			{renderedChangeRate && (
				<div className='mt-5 flex items-center gap-2 truncate'>
					{renderedChangeRate}

					{item.changeRateDescription && (
						<p className='text-sm'>{item.changeRateDescription}</p>
					)}
				</div>
			)}
		</div>
	)
}

export const AdminSalesCardSkeleton = () => {
	return <Skeleton className='h-32 w-full rounded-2xl' />
}
