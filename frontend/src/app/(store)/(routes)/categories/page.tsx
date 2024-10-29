import Link from 'next/link'

import { Metadata } from 'next'

import { categoriesService } from '@/modules/categories/services/categories.service'

export const metadata: Metadata = {
	title: 'Категории'
}

export default async function CategoriesPage() {
	const categories = await categoriesService.getCategories()

	return (
		<div>
			<h1 className='mt-4 text-3xl font-bold'>Категории</h1>

			<div className='mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
				{categories.map(category => (
					<div
						key={category.id}
						className='flex flex-col gap-2'
					>
						<Link
							href={`/products?categories=${category.id}`}
							className='text-sm font-bold'
						>
							{category.name}
						</Link>

						{category.subCategories.map(item => (
							<Link
								key={item.id}
								href={`/products?subCategoryId=${item.id}`}
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
