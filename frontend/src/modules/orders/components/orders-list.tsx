'use client'

import Image from 'next/image'
import Link from 'next/link'

import { Suspense, useState } from 'react'

import { useMyOrders } from '../hooks/use-my-orders.hook'
import { ORDER_STATUS_FORMATTED } from '../models/orders.types'
import { formatOrderDate } from '../utils/format-date.util'

import { Button } from '@/core/components/ui/button'
import { getPage } from '@/core/config/pages.config'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { DEFAULT_LIMIT } from '@/core/lib/pagintation.utils'
import { formatPrice } from '@/core/lib/price.utils'

export const OrdersList = () => {
	const [limit, setLimit] = useState(DEFAULT_LIMIT)
	const { data: orders } = useMyOrders({ limit })

	const handleLoadMore = () => {
		const leftItemsCount = orders.meta.totalItems - limit
		if (leftItemsCount >= DEFAULT_LIMIT)
			return setLimit(prevLimit => prevLimit + DEFAULT_LIMIT)
		if (leftItemsCount < DEFAULT_LIMIT && leftItemsCount > 0) {
			return setLimit(prevLimit => prevLimit + leftItemsCount)
		}
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{orders.data.length === 0 && (
				<p className='text-muted-foreground'>Заказы не найдены</p>
			)}

			<div className='flex flex-col gap-4'>
				{orders.data.map(order => (
					<Link
						key={order.id}
						href={`${getPage('PROFILE_ORDERS').href}/${order.id}`}
						className='rounded-xl bg-muted/30 p-6 hover:bg-muted/50'
					>
						<div className='flex items-center justify-between gap-4'>
							<div>
								<p className='text-2xl font-bold'>
									Заказ от {formatOrderDate(order.createdAt)}
								</p>
								<p className='mt-2 text-base text-primary'>
									{ORDER_STATUS_FORMATTED[order.status]}
								</p>
							</div>

							<div>
								<p className='text-2xl font-bold'>
									{formatPrice(order.totalPrice)}
								</p>
								<p className='mt-2 text-base text-primary'>
									{order.isPaid ? 'Оплачено' : 'Ожидается оплата'}
								</p>
							</div>
						</div>

						<div className='mt-4 flex gap-2 overflow-x-auto pb-2'>
							{order.orderItems.map(({ product }) => (
								<Image
									key={product.id}
									src={getProductImageUrl(product.images[0])}
									alt={product.name}
									width={112}
									height={128}
									className='h-32 w-28 flex-shrink-0 rounded-lg bg-muted object-contain p-2'
								/>
							))}
						</div>
					</Link>
				))}
			</div>

			{orders.meta.totalItems - limit > 0 && (
				<div className='mt-6 flex justify-center'>
					<Button
						variant='ghost'
						className='text-primary'
						onClick={handleLoadMore}
					>
						Еще
					</Button>
				</div>
			)}
		</Suspense>
	)
}
