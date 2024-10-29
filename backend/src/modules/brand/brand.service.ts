import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { Brand } from '@prisma/client'
import { PaginateQuery } from 'nestjs-paginate'
import { LoggerService } from 'src/modules/logger/logger.service'
import { getFilterOptions } from 'src/utils/filter.utils'
import { paginateResponse } from 'src/utils/paginate-response.utils'
import { getPaginationMeta } from 'src/utils/pagination.util'
import { PrismaService } from '../../database/prisma.service'
import { CreateBrandDto, UpdateBrandDto } from './brand.dto'

@Injectable()
export class BrandService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService,
	) {}

	async getAllBrands(search: string) {
		try {
			return this.prisma.brand.findMany({
				where: {
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{
							brandCategories: {
								some: {
									name: { contains: search, mode: 'insensitive' },
								},
							},
						},
					],
				},
				include: { brandCategories: true },
				orderBy: {
					name: 'asc',
				},
			})
		} catch (error) {
			this.logger.error(`Failed to fetch categories: ${error.message}`, error.stack)
			throw new InternalServerErrorException('Failed to fetch categories')
		}
	}

	async getPageable(query: PaginateQuery) {
		try {
			const filterOptions = getFilterOptions<Brand>(query.filter)
			const paginationMeta = getPaginationMeta(query)

			const trimmedSearch = query.search?.trim() ?? ''

			const [brands, totalItems] = await this.prisma.$transaction([
				this.prisma.brand.findMany({
					where: {
						OR: [
							{ name: { contains: trimmedSearch, mode: 'insensitive' } },
							{
								brandCategories: {
									some: {
										name: { contains: trimmedSearch, mode: 'insensitive' },
									},
								},
							},
						],
						...filterOptions,
					},
					skip: paginationMeta.skip,
					take: paginationMeta.take,
					orderBy: { createdAt: 'desc' },
					include: {
						brandCategories: true,
					},
				}),
				this.prisma.brand.count({
					where: {
						OR: [
							{ name: { contains: trimmedSearch, mode: 'insensitive' } },
							{
								brandCategories: {
									some: {
										name: { contains: trimmedSearch, mode: 'insensitive' },
									},
								},
							},
						],
						...filterOptions,
					},
				}),
			])

			return paginateResponse(query, brands, totalItems)
		} catch (err) {
			console.error(`Failed to fetch brands: ${err.message}`)
			throw new InternalServerErrorException(`Failed to fetch brands: ${err.message}`)
		}
	}

	async getBrandById(id: string) {
		const brand = await this.prisma.brand.findUnique({
			where: { id },
			include: {
				brandCategories: true,
			},
		})

		if (!brand) {
			throw new NotFoundException(`Brand with ID ${id} not found`)
		}

		return brand
	}

	async createBrand(dto: CreateBrandDto) {
		const { name, description, url, brandCategories } = dto

		const existingBrand = await this.prisma.brand.findFirst({ where: { name } })
		if (existingBrand) {
			throw new BadRequestException('Brand already exists with name ' + name)
		}

		try {
			return await this.prisma.$transaction(async prisma => {
				const brand = await prisma.brand.create({
					data: {
						name,
						description,
						url,
					},
				})

				if (brandCategories && brandCategories.length > 0) {
					const brandCategoryData = brandCategories.map(category => ({
						name: category.name,
						brandId: brand.id,
					}))

					await prisma.brandCategory.createMany({
						data: brandCategoryData,
					})
				}

				return brand
			})
		} catch (error) {
			this.logger.error(`Failed to create brand with categories: ${error.message}`, error.stack)
			throw new InternalServerErrorException('Failed to create brand')
		}
	}

	async updateBrand(id: string, dto: UpdateBrandDto) {
		const existingBrand = await this.prisma.brand.findUnique({
			where: { id },
		})

		if (!existingBrand) {
			throw new NotFoundException(`Brand with ID ${id} not found`)
		}

		return this.prisma.brand.update({
			where: { id },
			data: dto,
		})
	}

	async deleteBrand(id: string) {
		return this.prisma.brand.delete({
			where: { id },
		})
	}
}
