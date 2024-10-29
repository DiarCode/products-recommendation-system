import {
	BrandCategory,
	CreateBrandCategoriesDTO,
	UpdateBrandCategoryDTO
} from '../models/brand-category.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'
import { getPaginationMeta } from '@/core/lib/pagintation.utils'
import { PaginateQuery, Paginated } from '@/core/models/paginate.types'

class BrandCategoriesService {
	private readonly url = `/api/v1/brand-categories`

	async getBrandCategoriesPageable(query?: PaginateQuery) {
		const params = getPaginationMeta(query)

		return fetchWrapper.get<Paginated<BrandCategory>>(`${this.url}/pageable`, {
			params
		})
	}

	async createBrandCategories(dto: CreateBrandCategoriesDTO) {
		return fetchWrapper.post<void>(this.url, dto)
	}

	async updateBrandCategory(id: string, dto: UpdateBrandCategoryDTO) {
		return fetchWrapper.put<void>(`${this.url}/${id}`, dto)
	}

	async deleteBrandCategory(id: string) {
		return fetchWrapper.delete<void>(`${this.url}/${id}`)
	}
}

export const brandCategoriesService = new BrandCategoriesService()
