import { Brands } from './brands.types'

export interface BrandCategory {
	id: string
	name: string
	createdAt: Date
	brandId: string
	brand: Brands
}

export interface CreateBrandCategoriesDTO {
	brandCategories: { name: string }[]
	brandId: string
}

export interface UpdateBrandCategoryDTO {
	name?: string
}
