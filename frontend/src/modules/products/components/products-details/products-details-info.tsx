'use client'

import Link from 'next/link'

import { Star } from 'lucide-react'
import { Suspense } from 'react'
import { toast } from 'sonner'

import { Products } from '../../models/products.types'

import {
	ProductsCharacteristicsListItem,
	ProductsDetailsCharacteristics
} from './products-details-characteristics'
import { Button } from '@/core/components/ui/button'
import { ReadMoreText } from '@/core/components/ui/read-more-text'
import { ScrollArea } from '@/core/components/ui/scroll-area'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/core/components/ui/sheet'
import { Skeleton } from '@/core/components/ui/skeleton'
import { formatPrice } from '@/core/lib/price.utils'
import { useCartStore } from '@/modules/cart/store/cart.store'

interface ProductsDetailsInfoProps {
	product: Products
}

export const ProductsDetailsInfo = ({ product }: ProductsDetailsInfoProps) => {
	const { addToCart, isProductInCart } = useCartStore()

	const onAddClick = () => {
		addToCart(product.id)
		toast.info('Товар добавлен в корзину')
	}

	const mainChars: ProductsCharacteristicsListItem[] = [
		{ label: 'Производитель', value: product.brand.name },
		{ label: 'Подкатегория', value: product.subCategory.name },
		{ label: 'Артикул', value: product.articul },
		{ label: 'Штрихкод', value: product.barcode }
	]

	const technicalChars: ProductsCharacteristicsListItem[] = [
		...Object.entries(product?.characteristics ?? {}).map(([key, value]) => ({
			label: key,
			value: value
		}))
	]

	return (
		<Suspense fallback={<Skeleton className='h-40 w-full rounded-lg' />}>
			<h1 className='text-xl font-bold'>{product.name}</h1>

			<div className='mt-4 flex items-center gap-4'>
				<button className='flex items-center gap-1'>
					<Star className='h-4 fill-current text-yellow-400' />
					<p>{product.ratingValue.toFixed(1)}</p>
				</button>

				<button>
					<p className='text-muted-foreground underline'>
						{product.ratingCount} отзывы
					</p>
				</button>
			</div>

			<div className='mt-4 block lg:hidden'>
				<p className='text-3xl font-bold text-primary'>
					{formatPrice(product.price)}
				</p>
			</div>

			<ReadMoreText
				className='mt-6'
				clamp='4'
			>
				{product.description}
			</ReadMoreText>

			<div className='mt-8'>
				<ProductsDetailsCharacteristics items={mainChars} />

				<Sheet>
					<SheetTrigger asChild>
						<button className='mt-4 cursor-pointer text-muted-foreground underline'>
							Все характеристики
						</button>
					</SheetTrigger>
					<SheetContent>
						<SheetHeader>
							<SheetTitle>Характеристики</SheetTitle>
						</SheetHeader>

						<ScrollArea className='mt-6 h-[90vh]'>
							<div>
								<p className='text-base font-bold'>Основная информация</p>
								<ProductsDetailsCharacteristics
									items={mainChars}
									className='mt-5'
								/>
							</div>

							<div className='mt-10'>
								<p className='text-base font-bold'>Дополнительная информация</p>
								<ProductsDetailsCharacteristics
									items={technicalChars}
									className='mt-5'
								/>
							</div>
						</ScrollArea>
					</SheetContent>
				</Sheet>
			</div>

			<div className='mt-8 block lg:hidden'>
				{!isProductInCart(product.id) ? (
					<Button
						onClick={onAddClick}
						className='w-full rounded-xl py-6 text-base font-semibold'
					>
						Добавить в корзину
					</Button>
				) : (
					<Link href='/cart'>
						<Button className='w-full rounded-xl bg-primary/10 py-6 text-base font-semibold text-primary hover:bg-primary/30'>
							В корзине
						</Button>
					</Link>
				)}
			</div>
		</Suspense>
	)
}
