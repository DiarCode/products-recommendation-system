import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { CreateRatingDto } from './product-ratings-dto.types'
import { ProductRatingsService } from './product-ratings.service'

import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager'
import { Inject, UseInterceptors } from '@nestjs/common'

export const PRODUCT_RATINGS_CACHE_TTL = 86400000 // 24 hours
export const PRODUCT_RATINGS_CACHE_KEY = 'product-ratings'

@Controller('product-ratings')
@UseInterceptors(CacheInterceptor)
export class ProductRatingsController {
	constructor(
		private readonly productRatingsService: ProductRatingsService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Post()
	@Auth()
	async createRating(@CurrentUser('id') userId: string, @Body() dto: CreateRatingDto) {
		const rating = await this.productRatingsService.createRating(dto, userId)
		await this.cacheManager.del(`${PRODUCT_RATINGS_CACHE_KEY}-${dto.productId}`)
		return rating
	}

	@Get('check/:productId')
	@Auth()
	async checkIfUserCanRate(
		@Param('productId') productId: string,
		@CurrentUser('id') userId: string,
	) {
		return this.productRatingsService.checkIfUserCanRate(productId, userId)
	}

	@Get('my')
	@Auth()
	async getMyRatings(@CurrentUser('id') userId: string) {
		return this.productRatingsService.getRatingsByUser(userId)
	}

	@Get(':productId')
	async getRatingsForProduct(@Param('productId') productId: string) {
		const cacheKey = `${PRODUCT_RATINGS_CACHE_KEY}-${productId}`
		const cachedRatings = await this.cacheManager.get(cacheKey)

		if (cachedRatings) {
			return cachedRatings
		}

		const ratings = await this.productRatingsService.getRatingsForProduct(productId)
		await this.cacheManager.set(cacheKey, ratings, PRODUCT_RATINGS_CACHE_TTL)
		return ratings
	}
}
