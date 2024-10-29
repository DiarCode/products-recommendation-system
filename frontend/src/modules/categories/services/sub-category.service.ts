import {
	CreateSubCategoryDTO,
	SubCategory,
	UpdateSubCategoryDTO
} from '../models/sub-categories.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'
import { getPaginationMeta } from '@/core/lib/pagintation.utils'
import { PaginateQuery, Paginated } from '@/core/models/paginate.types'

class SubCategoriesService {
	private readonly url = `/api/v1/sub-categories`

	async getSubCategories(): Promise<SubCategory[]> {
		try {
			return await fetchWrapper.get<SubCategory[]>(this.url)
		} catch {
			return [] as SubCategory[]
		}
	}

	async getSubCategoriesPageable(
		query?: PaginateQuery
	): Promise<Paginated<SubCategory>> {
		const params = getPaginationMeta(query)
		return fetchWrapper.get<Paginated<SubCategory>>(`${this.url}/pageable`, {
			params
		})
	}

	async getSubCategoryById(id: string): Promise<SubCategory | null> {
		try {
			return await fetchWrapper.get<SubCategory>(`${this.url}/${id}`)
		} catch {
			return null
		}
	}

	async createSubCategories(dto: CreateSubCategoryDTO): Promise<void> {
		return fetchWrapper.post<void>(this.url, dto)
	}

	async updateSubCategory(
		id: string,
		dto: UpdateSubCategoryDTO
	): Promise<void> {
		return fetchWrapper.put<void>(`${this.url}/${id}`, dto)
	}

	async deleteSubCategory(id: string): Promise<void> {
		return fetchWrapper.delete<void>(`${this.url}/${id}`)
	}
}

export const subCategoriesService = new SubCategoriesService()
