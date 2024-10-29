'use client'

import Link from 'next/link'

import { Suspense } from 'react'

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from '@/core/components/ui/navigation-menu'
import { Skeleton } from '@/core/components/ui/skeleton'
import { useBrands } from '@/modules/brands/hooks/use-brands.hook'
import { Brands } from '@/modules/brands/models/brands.types'
import { useCategories } from '@/modules/categories/hooks/use-categories'
import { Category } from '@/modules/categories/models/categories.types'

export function PrimaryMainNav() {
	return (
		<div className='hidden gap-4 md:flex'>
			<Link
				href='/'
				className='flex items-center'
			>
				<span className='hidden text-xl font-medium sm:inline-block'>
					GGNet
				</span>
			</Link>
			<PrimaryNavMenu />
		</div>
	)
}

function PrimaryNavMenu() {
	const { data: categories } = useCategories()
	const { data: brands } = useBrands()

	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<Link
						href='/products'
						legacyBehavior
						passHref
					>
						<NavigationMenuLink className={navigationMenuTriggerStyle()}>
							<div className='font-normal text-foreground/70'>Товары</div>
						</NavigationMenuLink>
					</Link>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>
						<Link
							href='/categories'
							className='font-normal text-foreground/70'
						>
							Каталог
						</Link>
					</NavigationMenuTrigger>

					<NavigationMenuContent>
						<Suspense
							fallback={
								<div className='grid gap-x-10 gap-y-8 p-5 md:w-[500px] md:grid-cols-3 lg:w-[800px] lg:grid-cols-4'>
									<Skeleton className='h-4 w-full rounded-lg'></Skeleton>
								</div>
							}
						>
							<ul className='grid gap-x-10 gap-y-8 p-5 md:w-[500px] md:grid-cols-3 lg:w-[800px] lg:grid-cols-4'>
								{categories.map(category => (
									<CategoriesListItem
										key={category.id}
										category={category}
									/>
								))}
							</ul>
						</Suspense>
					</NavigationMenuContent>
				</NavigationMenuItem>

				<NavigationMenuItem>
					<NavigationMenuTrigger>
						<Link
							href='/brands'
							className='font-normal text-foreground/70'
						>
							Бренды
						</Link>
					</NavigationMenuTrigger>

					<NavigationMenuContent>
						<Suspense
							fallback={
								<div className='grid gap-x-10 gap-y-8 p-5 md:w-[500px] md:grid-cols-3 lg:w-[800px] lg:grid-cols-4'>
									<Skeleton className='h-4 w-full rounded-lg'></Skeleton>
								</div>
							}
						>
							<ul className='grid gap-x-10 gap-y-8 p-5 md:w-[500px] md:grid-cols-3 lg:w-[800px] lg:grid-cols-4'>
								{brands.map(brand => (
									<BrandListItem
										key={brand.id}
										brand={brand}
									/>
								))}
							</ul>
						</Suspense>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	)
}

interface CategoriesListItemProps {
	category: Category
}

const CategoriesListItem = ({ category }: CategoriesListItemProps) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<div className='flex flex-col gap-2'>
					<p className='text-sm font-bold'>{category.name}</p>

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
			</NavigationMenuLink>
		</li>
	)
}

interface BrandListItemProps {
	brand: Brands
}

const BrandListItem = ({ brand }: BrandListItemProps) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<div className='flex flex-col gap-2'>
					<p className='text-sm font-bold'>{brand.name}</p>

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
			</NavigationMenuLink>
		</li>
	)
}
