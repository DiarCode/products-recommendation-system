import {
	Category,
	CreateCategoryDTO,
	GetCategoriesFilter,
	UpdateCategoryDTO
} from '../models/categories.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'
import {
	getPaginationMeta,
	getUrlSearchParams
} from '@/core/lib/pagintation.utils'
import { PaginateQuery, Paginated } from '@/core/models/paginate.types'

class CategoriesService {
	private readonly url = `/api/v1/categories`

	async getCategories(filter?: GetCategoriesFilter): Promise<Category[]> {
		const params = getUrlSearchParams(filter)

		try {
			return await fetchWrapper.get<Category[]>(this.url, { params })
		} catch {
			return [] as Category[]
		}
	}

	async getCategoriesPageable(
		query?: PaginateQuery
	): Promise<Paginated<Category>> {
		const params = getPaginationMeta(query)

		return fetchWrapper.get<Paginated<Category>>(`${this.url}/pageable`, {
			params
		})
	}

	async getCategoryById(id: string): Promise<Category | null> {
		try {
			return await fetchWrapper.get<Category>(`${this.url}/${id}`)
		} catch {
			return null
		}
	}

	async createCategory(dto: CreateCategoryDTO): Promise<void> {
		return fetchWrapper.post<void>(this.url, dto)
	}

	async updateCategory(id: string, dto: UpdateCategoryDTO): Promise<void> {
		return fetchWrapper.put<void>(`${this.url}/${id}`, dto)
	}

	async deleteCategory(id: string): Promise<void> {
		return fetchWrapper.delete<void>(`${this.url}/${id}`)
	}
}

export const categoriesService = new CategoriesService()
