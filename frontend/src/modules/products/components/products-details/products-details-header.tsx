'use client'

import { useRouter } from 'next/navigation'

import { ArrowLeft, Heart, Share2, SlashIcon } from 'lucide-react'
import { MouseEvent } from 'react'
import { toast } from 'sonner'

import { Products } from '../../models/products.types'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator
} from '@/core/components/ui/breadcrumb'
import { cn } from '@/core/lib/tailwind.utils'
import { useFavoritesStore } from '@/modules/favorites/store/favorites.store'

interface ProductsDetailsHeaderProps {
	className?: string
	product: Products
}

export const ProductsDetailsHeader = ({
	className,
	product
}: ProductsDetailsHeaderProps) => {
	const { isFavorite, addFavorite, removeFavorite } = useFavoritesStore()
	const router = useRouter()

	const onFavoriteClick = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()

		if (isFavorite(product.id)) {
			removeFavorite(product.id)
			toast.info('Товар удалён из избранного')
		} else {
			addFavorite(product.id)
			toast.info('Товар добавлен в избранное')
		}
	}

	const onCopyClick = async () => {
		await navigator.clipboard.writeText(window.location.toString())
		toast.info('Ссылка на товар скопирована')
	}

	return (
		<div className={cn('flex items-center justify-between gap-6', className)}>
			<div className='flex items-center gap-6 text-sm'>
				<button onClick={() => router.back()}>
					<ArrowLeft className='h-6' />
				</button>

				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<BreadcrumbLink href='/'>Главная</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<SlashIcon />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink href='/products'>Товары</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator>
							<SlashIcon />
						</BreadcrumbSeparator>
						<BreadcrumbItem>
							<BreadcrumbLink
								href={`/products?subCategoryId=${product.subCategoryId}`}
							>
								{product.subCategory.name}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			<div className='flex items-center gap-4'>
				<button onClick={onFavoriteClick}>
					<Heart
						className={cn(
							'h-6 w-6',
							isFavorite(product.id)
								? 'fill-primary text-primary'
								: 'text-foreground hover:text-primary'
						)}
					/>
				</button>

				<button onClick={onCopyClick}>
					<Share2 className='h-6 w-6 hover:text-primary' />
				</button>
			</div>
		</div>
	)
}
