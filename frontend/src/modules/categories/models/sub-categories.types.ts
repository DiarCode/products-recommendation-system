export interface SubCategory {
	id: string
	name: string
	categoryId: string
}

interface SubCategoryDTO {
	name: string
}

export interface CreateSubCategoryDTO {
	subCategories: SubCategoryDTO[]
	categoryId: string
}

export interface UpdateSubCategoryDTO {
	name?: string
}
