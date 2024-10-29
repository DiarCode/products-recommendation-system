import { BrandCategory } from '@/modules/brands/models/brand-category.types'
import { Brands } from '@/modules/brands/models/brands.types'
import { SubCategory } from '@/modules/categories/models/sub-categories.types'

export enum ProductsStatus {
	ACTIVE = 'ACTIVE',
	ARCHIVED = 'ARCHIVED'
}

export const FORMATTED_PRODUCTS_STATUS: Record<ProductsStatus, string> = {
	[ProductsStatus.ACTIVE]: 'Активный',
	[ProductsStatus.ARCHIVED]: 'Архивный'
}

export interface Products {
	id: string
	name: string
	description: string
	subCategoryId: string
	characteristics: Record<string, string>
	brandId: string
	images: string[]
	articul: string
	brandCategoryId: string
	barcode: string
	price: number
	stock: number
	ratingValue: number
	ratingCount: number
	createdAt: Date
	subCategory: SubCategory
	brand: Brands
	brandCategory: BrandCategory
	status: ProductsStatus
}
