'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { Suspense } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/core/components/ui/button'
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Label } from '@/core/components/ui/label'
import { Skeleton } from '@/core/components/ui/skeleton'
import { Textarea } from '@/core/components/ui/textarea'
import { cn } from '@/core/lib/tailwind.utils'
import {
	CHECK_PRODUCT_RATINGS_QUERY_KEY,
	useCheckProductRating
} from '@/modules/product-ratings/hooks/use-check-product-rating.hook'
import { CreateRatingDto } from '@/modules/product-ratings/models/product-ratings.types'
import { productRatingsService } from '@/modules/product-ratings/services/product-ratings.service'

const ratingSchema = z.object({
	rating: z
		.number()
		.min(1, 'Рейтинг должен быть не меньше 1')
		.max(5, 'Рейтинг должен быть не больше 5'),
	comment: z.string().optional()
})

type RatingFormValues = z.infer<typeof ratingSchema>

interface RateProductCardProps {
	productId: string
	className?: string
}

export const RateProductCard: React.FC<RateProductCardProps> = ({
	productId,
	className
}) => {
	const queryClient = useQueryClient()
	const { data: userProductRating } = useCheckProductRating(productId)

	const form = useForm<RatingFormValues>({
		resolver: zodResolver(ratingSchema)
	})

	const { mutate: createRating, isPending: isRatingCreating } = useMutation({
		mutationFn: (dto: CreateRatingDto) =>
			productRatingsService.createRating(dto),
		onSuccess: () => {
			toast.success('Спасибо за ваш отзыв!')
			form.reset()
			queryClient.invalidateQueries({
				queryKey: [CHECK_PRODUCT_RATINGS_QUERY_KEY]
			})
		},
		onError: () => {
			toast.error('Ошибка при отправке отзыва')
		}
	})

	const onSubmit = (values: RatingFormValues) => {
		const dto: CreateRatingDto = {
			productId: productId,
			rating: values.rating,
			comment: values.comment
		}

		createRating(dto)
	}

	return (
		<Suspense fallback={<Skeleton className='h-32 w-full rounded-2xl' />}>
			{!userProductRating.canRate && !userProductRating.rating ? null : (
				<div
					className={cn('rounded-2xl bg-background p-4 shadow-2xl', className)}
				>
					{userProductRating?.rating ? (
						<div>
							<p className='text-lg font-semibold'>
								Вы уже оценили этот продукт
							</p>
							<div className='mt-4 space-y-2'>
								<Label>Рейтинг</Label>
								<StarRating rating={userProductRating.rating.rating} />
							</div>

							<div className='mt-5 space-y-1'>
								<Label>Комментарий</Label>
								<p> {userProductRating.rating.comment || 'Без комментариев'}</p>
							</div>
						</div>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(onSubmit)}
								className='space-y-5'
							>
								<FormField
									control={form.control}
									name='rating'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Рейтинг</FormLabel>
											<FormControl>
												<StarRating
													rating={field.value || 0}
													onChange={value => {
														field.onChange(value)
													}}
													disabled={isRatingCreating}
												/>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name='comment'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Комментарий (необязательно)</FormLabel>
											<FormControl>
												<Textarea
													placeholder='Поделитесь своим мнением'
													{...field}
													disabled={isRatingCreating}
												/>
											</FormControl>
											<FormDescription>
												Ваш комментарий поможет другим покупателям.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<Button
									type='submit'
									disabled={isRatingCreating}
								>
									{isRatingCreating ? 'Отправка...' : 'Отправить отзыв'}
								</Button>
							</form>
						</Form>
					)}
				</div>
			)}
		</Suspense>
	)
}

interface StarRatingProps {
	rating: number
	onChange?: (value: number) => void
	disabled?: boolean
}

const StarRating: React.FC<StarRatingProps> = props => {
	const stars = Array.from({ length: 5 }, (_, index) => index + 1)

	const onStarClick = (value: number) => {
		if (!props?.disabled && props.onChange) {
			props.onChange(value)
		}
	}

	return (
		<div className='flex space-x-1'>
			{stars.map(star => (
				<button
					key={star}
					type='button'
					onClick={() => onStarClick(star)}
					className={cn(`flex items-center justify-center`)}
					disabled={props?.disabled}
				>
					<Star
						className={cn(
							'h-8 w-8',
							star <= props.rating
								? 'fill-yellow-400 text-yellow-400'
								: 'text-gray-300 opacity-50'
						)}
					/>
				</button>
			))}
		</div>
	)
}
