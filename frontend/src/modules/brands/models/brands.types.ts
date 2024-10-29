import { BrandCategory } from './brand-category.types'

export interface Brands {
	id: string
	name: string
	description?: string
	url?: string
	createdAt: Date
	brandCategories: BrandCategory[]
}

export interface GetBrandsFilter {
	search?: string
}

export interface CreateBrandDTO {
	name: string
	brandCategories?: { name: string }[]
}

export interface UpdateBrandDTO {
	name?: string
	description?: string
	url?: string
}
