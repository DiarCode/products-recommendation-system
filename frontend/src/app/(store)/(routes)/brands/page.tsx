import Link from 'next/link'

import { Metadata } from 'next'

import { brandService } from '@/modules/brands/services/brands.service'

export const metadata: Metadata = {
	title: 'Бренды'
}

export default async function BrandsPage() {
	const brands = await brandService.getAll()

	return (
		<div>
			<h1 className='mt-4 text-3xl font-bold'>Бренды</h1>

			<div className='mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
				{brands.map(brand => (
					<div
						key={brand.id}
						className='flex flex-col gap-2'
					>
						<Link
							href={`/brands/${brand.id}`}
							className='text-sm font-bold'
						>
							{brand.name}
						</Link>

						{brand.brandCategories.map(item => (
							<Link
								key={item.id}
								href={`/products?brandCategoryId=${item.id}`}
								className='text-sm'
							>
								{item.name}
							</Link>
						))}
					</div>
				))}
			</div>
		</div>
	)
}
