import { CACHE_MANAGER, Cache, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	UseInterceptors,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Roles } from '../auth/roles/roles.decorator'
import { CreateBrandCategoriesDto, UpdateBrandCategoryDto } from './brand-category.dto'
import { BrandCategoryService } from './brand-category.service'

export const BRAND_CATEGORY_CACHE_KEY = 'brand-categories'
export const BRAND_CATEGORY_CACHE_TTL = 86400000 // 24 hours

@Controller('brand-categories')
@UseInterceptors(CacheInterceptor)
export class BrandCategoryController {
	constructor(
		private readonly brandCategoryService: BrandCategoryService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Get()
	@CacheKey(BRAND_CATEGORY_CACHE_KEY)
	@CacheTTL(BRAND_CATEGORY_CACHE_TTL)
	async getAll() {
		return this.brandCategoryService.getAllBrandCategories()
	}

	@Get('pageable')
	async getPageable(@Paginate() query: PaginateQuery) {
		return this.brandCategoryService.getPageable(query)
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.brandCategoryService.getBrandCategoryById(id)
	}

	@Post()
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createBrandSubCategoryDto: CreateBrandCategoriesDto) {
		const createdCategory =
			await this.brandCategoryService.createBrandCategories(createBrandSubCategoryDto)
		await this.cacheManager.del(BRAND_CATEGORY_CACHE_KEY)

		return createdCategory
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	async update(@Param('id') id: string, @Body() updateBrandSubCategoryDto: UpdateBrandCategoryDto) {
		const updatedCategory = await this.brandCategoryService.updateBrandSubCategory(
			id,
			updateBrandSubCategoryDto,
		)
		await this.cacheManager.del(BRAND_CATEGORY_CACHE_KEY)

		return updatedCategory
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.brandCategoryService.deleteBrandSubCategory(id)
		await this.cacheManager.del(BRAND_CATEGORY_CACHE_KEY)
	}
}
