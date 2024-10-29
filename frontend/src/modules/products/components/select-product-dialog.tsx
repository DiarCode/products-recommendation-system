'use client'

import Image from 'next/image'

import debounce from 'lodash.debounce'
import { Suspense, memo, useCallback, useState } from 'react'

import { useProducts } from '../hooks/use-products'
import { Products } from '../models/products.types'

import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import { Input } from '@/core/components/ui/input'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { DialogProps } from '@/core/hooks/use-dialog.hook'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { DEFAULT_LIMIT } from '@/core/lib/pagintation.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { cn } from '@/core/lib/tailwind.utils'

interface SelectProductDialogProps extends DialogProps {
	onSelectProduct: (product: Products) => void
}

export const SelectProductDialog = memo(
	({ isOpen, toggleDialog, onSelectProduct }: SelectProductDialogProps) => {
		const [query, setQuery] = useState({
			limit: DEFAULT_LIMIT,
			search: ''
		})
		const [selectedProduct, setSelectedProduct] = useState<Products | null>(
			null
		)

		const { data: products } = useProducts({ query })

		const handleLoadMore = useCallback(() => {
			const leftItemsCount = products?.meta.totalItems - query.limit
			if (leftItemsCount > 0) {
				setQuery(prevQuery => ({
					...prevQuery,
					limit: prevQuery.limit + Math.min(leftItemsCount, DEFAULT_LIMIT)
				}))
			}
		}, [products?.meta.totalItems, query.limit])

		const handleOnSelectClick = useCallback(() => {
			if (selectedProduct) {
				onSelectProduct(selectedProduct)
			}
		}, [selectedProduct, onSelectProduct])

		const updateSearch = debounce((value: string) => {
			setQuery(prev => ({ ...prev, search: value }))
		}, 500)

		return (
			<Dialog
				open={isOpen}
				onOpenChange={toggleDialog}
			>
				<DialogContent className='max-h-[95vh] max-w-[95vw]'>
					<DialogHeader>
						<DialogTitle>Выберите товар</DialogTitle>
					</DialogHeader>

					<Input
						className='w-full'
						placeholder='Поиск...'
						type='search'
						onChange={e => updateSearch(e.target.value)}
					/>

					<Suspense fallback='Загрузка...'>
						<div className='max-h-[60vh] overflow-y-auto'>
							<Table className='relative w-full'>
								<TableHeader className='sticky top-0 bg-background'>
									<TableRow>
										<TableHead className='hidden sm:table-cell'>
											<span className='sr-only'>Картина</span>
										</TableHead>
										<TableHead>Название</TableHead>
										<TableHead className='hidden md:table-cell'>
											Подкатегория
										</TableHead>
										<TableHead className='hidden md:table-cell'>
											Бренд
										</TableHead>
										<TableHead>Цена</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{products?.data.map(product => (
										<TableRow
											key={product.id}
											className={cn(
												'cursor-pointer',
												product.id === selectedProduct?.id &&
													'bg-primary text-primary-foreground hover:bg-primary/70 hover:text-primary-foreground'
											)}
											onClick={() => setSelectedProduct(product)}
										>
											<TableCell className='hidden sm:table-cell'>
												<Image
													alt={product.name}
													className='aspect-square rounded-sm bg-muted object-contain'
													height='54'
													src={getProductImageUrl(product.images[0])}
													loading='lazy'
													width='54'
												/>
											</TableCell>
											<TableCell className='font-medium'>
												{product.name}
											</TableCell>
											<TableCell>{product.brand.name}</TableCell>
											<TableCell>{product.subCategory.name}</TableCell>
											<TableCell>{formatPrice(product.price)}</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{products?.meta.totalItems - query.limit > 0 && (
							<div className='mt-4 flex justify-center'>
								<Button
									variant='ghost'
									className='text-primary'
									type='button'
									onClick={handleLoadMore}
								>
									Еще
								</Button>
							</div>
						)}
					</Suspense>

					<DialogFooter className='mt-4 gap-4 sm:justify-start'>
						<Button
							type='button'
							variant='default'
							disabled={!selectedProduct}
							onClick={handleOnSelectClick}
						>
							Выбрать
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		)
	}
)

SelectProductDialog.displayName = 'SelectProductDialog'
