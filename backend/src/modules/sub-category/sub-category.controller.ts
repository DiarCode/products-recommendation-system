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
	UseInterceptors,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Roles } from '../auth/roles/roles.decorator'
import { CreateSubCategoriesDto, UpdateSubCategoryDto } from './sub-category.dto'
import { SubCategoryService } from './sub-category.service'

export const SUB_CATEGORY_CACHE_KEY = 'sub-categories'
export const SUB_CATEGORY_CACHE_TTL = 86400000 // 24 hours

@Controller('sub-categories')
@UseInterceptors(CacheInterceptor)
export class SubCategoryController {
	constructor(
		private readonly subCategoryService: SubCategoryService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Get()
	@CacheKey(SUB_CATEGORY_CACHE_KEY)
	@CacheTTL(SUB_CATEGORY_CACHE_TTL)
	async getAllSubCategories() {
		return this.subCategoryService.getAllSubCategories()
	}

	@Get('pageable')
	async getSubCategoriesPageable(@Paginate() query: PaginateQuery) {
		return this.subCategoryService.getSubCategoriesPageable(query)
	}

	@Get(':id')
	async getSubCategoryById(@Param('id') id: string) {
		return this.subCategoryService.getSubCategoryById(id)
	}

	@Post()
	@Roles(Role.ADMIN)
	async createSubCategories(@Body() createSubCategoryDto: CreateSubCategoriesDto) {
		const createdSubCategory =
			await this.subCategoryService.createSubCategories(createSubCategoryDto)
		await this.cacheManager.del(SUB_CATEGORY_CACHE_KEY)
		return createdSubCategory
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	async updateSubCategory(
		@Param('id') id: string,
		@Body() updateSubCategoryDto: UpdateSubCategoryDto,
	) {
		const updatedSubCategory = await this.subCategoryService.updateSubCategory(
			id,
			updateSubCategoryDto,
		)
		await this.cacheManager.del(SUB_CATEGORY_CACHE_KEY)
		return updatedSubCategory
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	async deleteSubCategory(@Param('id') id: string) {
		await this.subCategoryService.deleteSubCategory(id)
		await this.cacheManager.del(SUB_CATEGORY_CACHE_KEY)
	}
}
