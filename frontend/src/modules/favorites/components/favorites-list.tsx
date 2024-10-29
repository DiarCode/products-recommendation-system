'use client'

import Link from 'next/link'

import { Suspense } from 'react'

import { useFetchedFavorites } from '../hooks/use-favorites.hook'

import { Button } from '@/core/components/ui/button'
import { ProductsList } from '@/modules/products/components/products-list'

export const FavoritesList = () => {
	const { data: products } = useFetchedFavorites()

	return (
		<Suspense fallback='Загрузка...'>
			{products.length === 0 && (
				<div className='flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-lg font-bold'>
							В избранном пока пусто
						</h1>
						<h2 className='mt-4 text-center'>
							Сохраняйте товары, которые понравились, чтобы долго не искать
						</h2>
						<div className='mt-6 flex justify-center'>
							<Link href='/'>
								<Button>Перейти на главную</Button>
							</Link>
						</div>
					</div>
				</div>
			)}

			<ProductsList products={products} />
		</Suspense>
	)
}
