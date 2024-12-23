import {
	Body,
	Controller,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Role } from '@prisma/client'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Roles } from '../auth/roles/roles.decorator'
import { CreateProductDto, UpdateProductDto } from './product.dto'
import { ProductService } from './product.service'
import { Cache, CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager'

export const RECOMMENDATION_CACHE_KEY = 'recommendations'
export const RECOMMENDATION_CACHE_TTL = 600000

@Controller('products')
@UseInterceptors(CacheInterceptor)
export class ProductController {
	constructor(
		private readonly productService: ProductService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Post()
	@Roles(Role.ADMIN)
	@UseInterceptors(FilesInterceptor('images[]', 10))
	async createProduct(
		@Body() dto: CreateProductDto,
		@UploadedFiles() images: Express.Multer.File[],
	) {
		return this.productService.createProduct(dto, images)
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	@UseInterceptors(FilesInterceptor('images[]', 10))
	async updateProduct(
		@Param('id') productId: string,
		@Body() updateProductDto: UpdateProductDto,
		@UploadedFiles() images: Express.Multer.File[],
	) {
		return this.productService.updateProduct(productId, updateProductDto, images)
	}

	@Get()
	async getPaginatedProducts(@Paginate() query: PaginateQuery) {
		return this.productService.getPaginatedProducts(query)
	}

	@Get('all')
	async getAllProducts() {
		return this.productService.getAllProducts()
	}

	@Get('my-history')
	@Auth()
	async getMyHistoryProducts(@CurrentUser('id') userId: string) {
		return this.productService.getHistoryProductsByUser(userId)
	}

	@Get('my-recommendations')
	@Auth()
	async getMyRecommendedProducts(@CurrentUser('id') userId: string) {
		/*const cacheKey = `${RECOMMENDATION_CACHE_KEY}:${userId}`

		const cachedRecommendations = await this.cacheManager.get(cacheKey)
		if (cachedRecommendations) {
			return cachedRecommendations
		}*/

		const recommendations = await this.productService.getRecommendedProductsByUser(userId)

		//await this.cacheManager.set(cacheKey, recommendations, RECOMMENDATION_CACHE_TTL)

		return recommendations
	}

	@Get('by-ids')
	async getProductByIds(@Query('ids') productIds: string) {
		return this.productService.getProductByIds(productIds)
	}

	@Post('visited-products/:id')
	@Auth()
	async saveVisitedProduct(@Param('id') productId: string, @CurrentUser('id') userId: string) {
		return this.productService.addVisitedProduct(userId, productId)
	}

	@Post('search-term')
	@Auth()
	async saveSearchTerms(@Query('term') searchTerm: string, @CurrentUser('id') userId: string) {
		console.log('TERM', searchTerm)
		return this.productService.addSearchTerm(userId, searchTerm)
	}

	@Get(':id')
	async getProductById(@Param('id') productId: string) {
		return this.productService.getProductById(productId)
	}
}
