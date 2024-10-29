'use client'

import Link from 'next/link'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Star } from 'lucide-react'
import { Suspense } from 'react'

import { useMyProductRatings } from '../hooks/use-my-ratings.hook'

import { getPage } from '@/core/config/pages.config'
import { cn } from '@/core/lib/tailwind.utils'
import { getUserFullName } from '@/modules/users/utils/users-format.utils'

export const MyRatingsList = () => {
	const { data: ratings } = useMyProductRatings()

	const getProductDetailsHref = (productId: string) => {
		return `${getPage('PRODUCTS').href}/${productId}`
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{ratings.length === 0 && (
				<p className='mt-2 text-muted-foreground'>
					У вас еще нет оставленных отзывов
				</p>
			)}
			<div
				className={'grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-3'}
			>
				{ratings.map(rating => (
					<Link
						href={getProductDetailsHref(rating.productId)}
						key={rating.id}
						className='rounded-lg border bg-background p-4'
					>
						<div className='flex items-center justify-between gap-4'>
							<div className='flex items-center gap-2'>
								<p className='font-semibold'>{getUserFullName(rating.user)}</p>
								<p className='text-muted-foreground'>
									{format(new Date(rating.createdAt), 'd MMMM', {
										locale: ru
									})}
								</p>
							</div>

							<StarRating rating={rating.rating} />
						</div>

						<p className='mt-2 overflow-hidden text-ellipsis'>
							{rating.comment || 'Без комментариев'}
						</p>
					</Link>
				))}
			</div>
		</Suspense>
	)
}

interface StarRatingProps {
	rating: number
}

const StarRating = ({ rating }: StarRatingProps) => {
	const stars = Array.from({ length: 5 }, (_, index) => index + 1)

	return (
		<div className='flex space-x-1'>
			{stars.map(star => (
				<Star
					key={star}
					className={cn(
						'h-5 w-5',
						star <= rating
							? 'fill-yellow-400 text-yellow-400'
							: 'text-gray-300 opacity-50'
					)}
				/>
			))}
		</div>
	)
}
