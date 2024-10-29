import { StoreConfig, UpdateStoreConfigDto } from '../models/store-config.types'

import { fetchWrapper } from '@/core/api/fetch-instance'

class AdminStoreConfigService {
	private readonly baseUrl = `/api/v1/store-configs`

	async getStoreConfig(config?: {
		headers?: Record<string, string>
	}): Promise<StoreConfig | null> {
		try {
			return await fetchWrapper.get<StoreConfig>(this.baseUrl, config)
		} catch {
			return null
		}
	}

	async updateStoreConfig(dto: UpdateStoreConfigDto): Promise<void> {
		const formData = new FormData()

		if (dto.storeDescription)
			formData.append('storeDescription', dto.storeDescription)
		if (dto.storeKeywords) formData.append('storeKeywords', dto.storeKeywords)
		if (dto.storeName) formData.append('storeName', dto.storeName)

		if (dto.landingImages && dto.landingImages.length > 0) {
			dto.landingImages.forEach(file => {
				formData.append('landingImages[]', file)
			})
		}

		if (dto.landingImagesToDelete && dto.landingImagesToDelete.length > 0) {
			formData.append(
				'landingImagesToDelete',
				JSON.stringify(dto.landingImagesToDelete)
			)
		}

		return fetchWrapper.put<void>(this.baseUrl, formData)
	}
}

export const adminStoreConfigsService = new AdminStoreConfigService()
