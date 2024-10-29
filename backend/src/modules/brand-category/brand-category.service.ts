import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { BrandCategory } from '@prisma/client'
import { PaginateQuery } from 'nestjs-paginate'
import { LoggerService } from 'src/modules/logger/logger.service'
import { getFilterOptions } from 'src/utils/filter.utils'
import { paginateResponse } from 'src/utils/paginate-response.utils'
import { getPaginationMeta } from 'src/utils/pagination.util'
import { PrismaService } from '../../database/prisma.service'
import { CreateBrandCategoriesDto, UpdateBrandCategoryDto } from './brand-category.dto'

@Injectable()
export class BrandCategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService,
	) {}

	async getAllBrandCategories() {
		return this.prisma.brandCategory.findMany()
	}

	async getPageable(query: PaginateQuery) {
		try {
			const filterOptions = getFilterOptions<BrandCategory>(query.filter)
			const paginationMeta = getPaginationMeta(query)

			const trimmedSearch = query.search?.trim() ?? ''

			const [brands, totalItems] = await this.prisma.$transaction([
				this.prisma.brandCategory.findMany({
					where: {
						OR: [{ name: { contains: trimmedSearch, mode: 'insensitive' } }],
						...filterOptions,
					},
					skip: paginationMeta.skip,
					take: paginationMeta.take,
					orderBy: { createdAt: 'desc' },
					include: {
						brand: true,
					},
				}),
				this.prisma.brandCategory.count({
					where: {
						OR: [{ name: { contains: trimmedSearch, mode: 'insensitive' } }],
						...filterOptions,
					},
				}),
			])

			return paginateResponse(query, brands, totalItems)
		} catch (err) {
			console.error(`Failed to fetch brand categories: ${err.message}`)
			throw new InternalServerErrorException(`Failed to fetch brand categories: ${err.message}`)
		}
	}

	async getBrandCategoryById(id: string) {
		const brandCategory = await this.prisma.brandCategory.findUnique({
			where: { id },
		})

		if (!brandCategory) {
			throw new NotFoundException(`Brand category with ID ${id} not found`)
		}

		return brandCategory
	}

	async createBrandCategories(dto: CreateBrandCategoriesDto) {
		const { brandCategories, brandId } = dto

		try {
			const brand = await this.prisma.brand.findUnique({
				where: { id: brandId },
			})

			if (!brand) {
				throw new NotFoundException(`Brand with ID ${brandId} not found`)
			}

			return await this.prisma.$transaction(async prisma => {
				const brandCategoryData = brandCategories.map(category => ({
					name: category.name,
					brandId: brand.id,
				}))

				const createdBrandCategories = await prisma.brandCategory.createMany({
					data: brandCategoryData,
				})

				return createdBrandCategories
			})
		} catch (error) {
			this.logger.error(
				`Failed to create brand categories for brand ${brandId}: ${error.message}`,
				error.stack,
			)
			throw new InternalServerErrorException('Failed to create brand categories')
		}
	}

	async updateBrandSubCategory(id: string, dto: UpdateBrandCategoryDto) {
		const existingBrandCategory = await this.prisma.brandCategory.findUnique({
			where: { id },
		})

		if (!existingBrandCategory) {
			throw new NotFoundException(`Brand сategory with ID ${id} not found`)
		}

		return this.prisma.brandCategory.update({
			where: { id },
			data: dto,
		})
	}

	async deleteBrandSubCategory(id: string) {
		return this.prisma.brandCategory.delete({
			where: { id },
		})
	}
}
