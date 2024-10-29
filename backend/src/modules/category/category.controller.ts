import { Cache, CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Post,
	Put,
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Roles } from '../auth/roles/roles.decorator'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'
import { CategoryService } from './category.service'

export const CATEGORY_CACHE_KEY = 'categories'
export const CATEGORY_CACHE_TTL = 86400000

@Controller('categories')
@UseInterceptors(CacheInterceptor)
export class CategoryController {
	constructor(
		private readonly categoryService: CategoryService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Get()
	@CacheKey(CATEGORY_CACHE_KEY)
	@CacheTTL(CATEGORY_CACHE_TTL)
	async getAllCategories(@Query('search') search: string) {
		return this.categoryService.getAllCategories(search)
	}

	@Get('pageable')
	async getCategoriesPageable(@Paginate() query: PaginateQuery) {
		return this.categoryService.getCategoriesPageable(query)
	}

	@Get(':id')
	async getCategoryById(@Param('id') categoryId: string) {
		return this.categoryService.getCategoryById(categoryId)
	}

	@Post()
	@Roles(Role.ADMIN)
	async createCategory(@Body() createCategoryDto: CreateCategoryDto) {
		const createdCategory = await this.categoryService.createCategory(createCategoryDto)
		await this.cacheManager.del(CATEGORY_CACHE_KEY)

		return createdCategory
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	async updateCategory(
		@Param('id') categoryId: string,
		@Body() updateCategoryDto: UpdateCategoryDto,
	) {
		const updatedCategory = await this.categoryService.updateCategory(categoryId, updateCategoryDto)
		await this.cacheManager.del(CATEGORY_CACHE_KEY)

		return updatedCategory
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	async deleteCategory(@Param('id') categoryId: string) {
		await this.categoryService.deleteCategory(categoryId)
		await this.cacheManager.del(CATEGORY_CACHE_KEY)
	}
}
