'use client'

import { cva } from 'class-variance-authority'
import { PropsWithChildren, useState } from 'react'

import { cn } from '@/core/lib/tailwind.utils'

interface ReadMoreTextProps extends PropsWithChildren {
	clamp?: '1' | '2' | '3' | '4' | '5' | '6'
	className?: string
}

const DEFAULT_CLAMP = '2'

const readMoreTextClasses = cva('line text-ellipsis', {
	variants: {
		clamp: {
			'1': 'line-clamp-1',
			'2': 'line-clamp-2',
			'3': 'line-clamp-3',
			'4': 'line-clamp-4',
			'5': 'line-clamp-5',
			'6': 'line-clamp-6',
			none: 'line-clamp-none'
		}
	},
	defaultVariants: {
		clamp: DEFAULT_CLAMP
	}
})

export const ReadMoreText = ({
	clamp = DEFAULT_CLAMP,
	className,
	children
}: ReadMoreTextProps) => {
	const [expanded, setExpanded] = useState(false)
	const toggleExpand = () => setExpanded(!expanded)

	return (
		<div>
			<p
				className={cn(
					readMoreTextClasses({ clamp: expanded ? 'none' : clamp }),
					className
				)}
			>
				{children}
			</p>

			<button
				className='mt-2 inline cursor-pointer text-muted-foreground underline'
				onClick={toggleExpand}
			>
				{expanded ? 'Скрыть' : 'Читать дальшe'}
			</button>
		</div>
	)
}
