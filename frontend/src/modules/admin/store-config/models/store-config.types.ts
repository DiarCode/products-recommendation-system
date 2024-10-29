export interface StoreConfig {
	storeName: string
	storeDescription: string
	storeKeywords: string
	landingImages: string[]
	createdAt: Date
	updatedAt: Date
}

export interface UpdateStoreConfigDto {
	storeName?: string
	storeDescription?: string
	storeKeywords?: string
	landingImages?: File[]
	landingImagesToDelete?: string[]
}
