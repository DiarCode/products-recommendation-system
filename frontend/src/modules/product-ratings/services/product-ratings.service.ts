import {
	CheckUserCanRateResponse,
	CreateRatingDto,
	ProductRating
} from '../models/product-ratings.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'

class ProductRatingsService {
	private readonly url = `/api/v1/product-ratings`

	async createRating(dto: CreateRatingDto): Promise<void> {
		return fetchWrapper.post<void>(this.url, dto)
	}

	async getRatingsForProduct(productId: string): Promise<ProductRating[]> {
		return fetchWrapper.get<ProductRating[]>(`${this.url}/${productId}`)
	}

	async checkIfUserCanRate(
		productId: string
	): Promise<CheckUserCanRateResponse> {
		try {
			return await fetchWrapper.get<CheckUserCanRateResponse>(
				`${this.url}/check/${productId}`
			)
		} catch {
			return { canRate: false }
		}
	}

	async getMyRatings(config?: {
		headers?: Record<string, string>
	}): Promise<ProductRating[]> {
		return fetchWrapper.get<ProductRating[]>(`${this.url}/my`, config)
	}
}

export const productRatingsService = new ProductRatingsService()
