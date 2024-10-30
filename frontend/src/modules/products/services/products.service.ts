import {
	CreateProductDto,
	UpdateProductDto
} from '../models/products-dto.types'
import { Products } from '../models/products.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { getPaginationMeta } from '@/core/lib/pagintation.utils'
import { PaginateQuery, Paginated } from '@/core/models/paginate.types'

class ProductsService {
	private readonly url = `/api/v1/products`

	async getPageableProducts(
		query?: PaginateQuery
	): Promise<Paginated<Products>> {
		const params = getPaginationMeta(query)
		return fetchWrapper.get<Paginated<Products>>(this.url, { params })
	}

	async getAllProducts(): Promise<Products[]> {
		try {
			return await fetchWrapper.get<Products[]>(`${this.url}/all`)
		} catch {
			return [] as Products[]
		}
	}

	async getMyHistoryProducts(config?: {
		headers?: Record<string, string>
	}): Promise<Products[]> {
		return fetchWrapper.get<Products[]>(`${this.url}/my-history`, config)
	}

	async getProductById(id: string): Promise<Products | null> {
		try {
			return await fetchWrapper.get<Products>(`${this.url}/${id}`)
		} catch {
			return null
		}
	}

	async updateProduct(id: string, dto: UpdateProductDto): Promise<void> {
		const formData = new FormData()

		if (dto.name) formData.append('name', dto.name)
		if (dto.description) formData.append('description', dto.description)
		if (dto.subCategoryId) formData.append('subCategoryId', dto.subCategoryId)
		if (dto.characteristics)
			formData.append('characteristics', JSON.stringify(dto.characteristics))
		if (dto.brandId) formData.append('brandId', dto.brandId)
		if (dto.status) formData.append('status', dto.status)
		if (dto.brandCategoryId)
			formData.append('brandCategoryId', dto.brandCategoryId)
		if (dto.articul) formData.append('articul', dto.articul)
		if (dto.barcode) formData.append('barcode', dto.barcode)
		if (dto.price !== undefined) formData.append('price', String(dto.price))
		if (dto.stock !== undefined) formData.append('stock', String(dto.stock))

		if (dto.images && dto.images.length > 0) {
			dto.images.forEach(file => {
				formData.append('images[]', file)
			})
		}

		if (dto.imagesToDelete && dto.imagesToDelete.length > 0) {
			formData.append('imagesToDelete', JSON.stringify(dto.imagesToDelete))
		}

		return fetchWrapper.put<void>(`${this.url}/${id}`, formData)
	}

	async createProduct(dto: CreateProductDto): Promise<void> {
		const formData = new FormData()

		formData.append('name', dto.name)
		formData.append('description', dto.description)
		formData.append('subCategoryId', dto.subCategoryId)
		formData.append('characteristics', JSON.stringify(dto.characteristics))
		formData.append('brandCategoryId', dto.brandCategoryId)
		formData.append('price', String(dto.price))
		formData.append('stock', String(dto.stock))

		if (dto.images && dto.images.length > 0) {
			dto.images.forEach(file => {
				formData.append('images[]', file)
			})
		}

		return fetchWrapper.post<void>(`${this.url}`, formData)
	}

	async getProductsByIds(productIds: string[]): Promise<Products[]> {
		try {
			return await fetchWrapper.get<Products[]>(
				`${this.url}/by-ids?ids=${productIds.join(',')}`
			)
		} catch {
			return [] as Products[]
		}
	}

	async saveVisitedProduct(productId: string) {
		return await fetchWrapper.post<void>(
			`${this.url}/visited-products/${productId}`
		)
	}

	async saveSearchTerms(searchTerm: string) {
		return await fetchWrapper.post<void>(
			`${this.url}/search-term`,
			{},
			{ params: { term: searchTerm } }
		)
	}
}

export const productsService = new ProductsService()
