import { ProductsStatus } from './products.types'

export interface UpdateProductDto {
	name?: string
	description?: string
	subCategoryId?: string
	characteristics?: Record<string, string>
	brandId?: string
	status?: ProductsStatus
	brandCategoryId?: string
	images?: File[]
	imagesToDelete?: string[]
	articul?: string
	barcode?: string
	price?: number
	stock?: number
}

export interface CreateProductDto {
	name: string
	description: string
	subCategoryId: string
	characteristics: Record<string, string>
	brandCategoryId: string
	images?: File[]
	price: number
	stock: number
}
