'use client'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Star } from 'lucide-react'
import React, { Suspense } from 'react'

import { cn } from '@/core/lib/tailwind.utils'
import { useProductRatings } from '@/modules/product-ratings/hooks/use-product-ratings.hook'
import { getUserFullName } from '@/modules/users/utils/users-format.utils'

interface ProductsRatingsListProps {
	productId: string
	className?: string
}

export const ProductsRatingsList: React.FC<ProductsRatingsListProps> = ({
	productId,
	className
}) => {
	const { data: ratings } = useProductRatings(productId)

	return (
		<Suspense fallback='Загрузка...'>
			{ratings.length > 0 ? (
				<div className={cn('overflow-x-auto whitespace-nowrap', className)}>
					<div className='flex space-x-2'>
						{ratings.map(rating => (
							<div
								key={rating.id}
								className='w-[400px] rounded-lg border bg-background p-4'
							>
								<div className='flex items-center justify-between gap-4'>
									<div className='flex items-center gap-2'>
										<p className='font-semibold'>
											{getUserFullName(rating.user)}
										</p>
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
							</div>
						))}
					</div>
				</div>
			) : (
				<p className='text-muted-foreground'>
					Пока нет оценок для этого продукта
				</p>
			)}
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
