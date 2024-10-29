import { SubCategory } from './sub-categories.types'

export interface Category {
	id: string
	name: string
	subCategories: SubCategory[]
}

export interface GetCategoriesFilter {
	search?: string
}

interface CreateSubCategoryDTO {
	name: string
}

export interface CreateCategoryDTO {
	name: string
	subCategories?: CreateSubCategoryDTO[]
}

export interface UpdateCategoryDTO {
	name?: string
}
