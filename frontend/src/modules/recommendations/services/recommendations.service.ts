import { fetchWrapper } from '@/core/api/fetch-instance'
import { getPaginationMeta } from '@/core/lib/pagintation.utils'
import { PaginateQuery, Paginated } from '@/core/models/paginate.types'
import { Products } from '@/modules/products/models/products.types'

class RecommendationsService {
	private readonly url = `/api/v1/products`

	async getMyRecommendations(): Promise<Products[]> {
		try {
			return await fetchWrapper.get<Products[]>(
				`${this.url}/my-recommendations`
			)
		} catch {
			return [] as Products[]
		}
	}
}

export const recommendationsService = new RecommendationsService()
