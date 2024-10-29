import { Metadata } from 'next'

import { brandService } from '@/modules/brands/services/brands.service'
import { QueryProductsList } from '@/modules/products/components/query-products-list'

type Props = {
	params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const id = params.id

	const brand = await brandService.getById(id)

	return {
		title: brand?.name ?? 'Бренд'
	}
}

export default async function BrandDetailsPage({ params }: Props) {
	const brand = await brandService.getById(params.id)

	return (
		<div className='mt-4'>
			<div className='flex items-center justify-between gap-4'>
				<h1 className='text-3xl font-bold'>{brand.name}</h1>

				{/* <Select>
					<SelectTrigger className='w-fit'>
						<SelectValue placeholder='Выберите категорию' />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Категория</SelectLabel>
							<SelectItem value='apple'>Весь ассортимент</SelectItem>
							<SelectItem value='banana'>Роутеры</SelectItem>
							<SelectItem value='blueberry'>Модемы</SelectItem>
							<SelectItem value='grapes'>Дроны</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select> */}
			</div>

			<QueryProductsList
				className='mt-5'
				query={{ filter: { brandId: brand.id } }}
			/>
		</div>
	)
}
