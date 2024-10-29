import { Cache, CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager'
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
	Query,
	UseInterceptors,
} from '@nestjs/common'
import { Role } from '@prisma/client'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Roles } from '../auth/roles/roles.decorator'
import { CreateBrandDto, UpdateBrandDto } from './brand.dto'
import { BrandService } from './brand.service'

export const BRAND_CACHE_KEY = 'brands'
export const BRAND_CACHE_TTL = 86400000 // 24 hours

@Controller('brands')
@UseInterceptors(CacheInterceptor)
export class BrandController {
	constructor(
		private readonly brandService: BrandService,
		@Inject(CACHE_MANAGER) private cacheManager: Cache,
	) {}

	@Get()
	@CacheKey(BRAND_CACHE_KEY)
	@CacheTTL(BRAND_CACHE_TTL)
	async getAll(@Query('search') search: string) {
		return this.brandService.getAllBrands(search)
	}

	@Get('pageable')
	async getPageable(@Paginate() query: PaginateQuery) {
		return this.brandService.getPageable(query)
	}

	@Get(':id')
	async getById(@Param('id') id: string) {
		return this.brandService.getBrandById(id)
	}

	@Post()
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.CREATED)
	async create(@Body() createBrandCategoryDto: CreateBrandDto) {
		const brand = await this.brandService.createBrand(createBrandCategoryDto)
		await this.cacheManager.del(BRAND_CACHE_KEY)

		return brand
	}

	@Put(':id')
	@Roles(Role.ADMIN)
	async update(@Param('id') id: string, @Body() updateBrandCategoryDto: UpdateBrandDto) {
		await this.cacheManager.del(BRAND_CACHE_KEY)
		return this.brandService.updateBrand(id, updateBrandCategoryDto)
	}

	@Delete(':id')
	@Roles(Role.ADMIN)
	@HttpCode(HttpStatus.NO_CONTENT)
	async delete(@Param('id') id: string) {
		await this.cacheManager.del(BRAND_CACHE_KEY)
		return this.brandService.deleteBrand(id)
	}
}
