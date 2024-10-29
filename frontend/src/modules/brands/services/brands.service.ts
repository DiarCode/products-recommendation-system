import {
	Brands,
	CreateBrandDTO,
	GetBrandsFilter,
	UpdateBrandDTO
} from '../models/brands.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import {
	getPaginationMeta,
	getUrlSearchParams
} from '@/core/lib/pagintation.utils'
import { PaginateQuery, Paginated } from '@/core/models/paginate.types'

class BrandService {
	private readonly baseUrl = `/api/v1/brands`

	async getAll(filter?: GetBrandsFilter): Promise<Brands[]> {
		const params = getUrlSearchParams(filter)

		try {
			return await fetchWrapper.get<Brands[]>(`${this.baseUrl}`, {
				params
			})
		} catch {
			return [] as Brands[]
		}
	}

	async getPageable(query?: PaginateQuery): Promise<Paginated<Brands>> {
		const params = getPaginationMeta(query)
		return fetchWrapper.get<Paginated<Brands>>(`${this.baseUrl}/pageable`, {
			params
		})
	}

	async getById(id: string): Promise<Brands> {
		return fetchWrapper.get<Brands>(`${this.baseUrl}/${id}`)
	}

	async createBrand(dto: CreateBrandDTO): Promise<void> {
		return fetchWrapper.post<void>(this.baseUrl, dto)
	}

	async updateBrand(id: string, dto: UpdateBrandDTO): Promise<void> {
		return fetchWrapper.put<void>(`${this.baseUrl}/${id}`, dto)
	}

	async deleteBrand(id: string): Promise<void> {
		return fetchWrapper.delete<void>(`${this.baseUrl}/${id}`)
	}
}

export const brandService = new BrandService()
