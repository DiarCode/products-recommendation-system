import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { Category } from '@prisma/client'
import { PaginateQuery } from 'nestjs-paginate'
import { getFilterOptions } from 'src/utils/filter.utils'
import { paginateResponse } from 'src/utils/paginate-response.utils'
import { getPaginationMeta } from 'src/utils/pagination.util'
import { PrismaService } from '../../database/prisma.service'
import { LoggerService } from '../logger/logger.service'
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto'

@Injectable()
export class CategoryService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService,
	) {}

	async getAllCategories(search: string) {
		try {
			const categories = await this.prisma.category.findMany({
				where: {
					OR: [
						{ name: { contains: search, mode: 'insensitive' } },
						{
							subCategories: {
								some: {
									name: { contains: search, mode: 'insensitive' },
								},
							},
						},
					],
				},
				include: {
					subCategories: true,
				},
				orderBy: {
					name: 'asc',
				},
			})
			return categories
		} catch (error) {
			this.logger.error(`Failed to fetch categories: ${error.message}`, error.stack)
			throw new InternalServerErrorException('Failed to fetch categories')
		}
	}

	async getCategoriesPageable(query: PaginateQuery) {
		try {
			const filterOptions = getFilterOptions<Category>(query.filter)
			const paginationMeta = getPaginationMeta(query)

			const trimedSearch = query.search?.trim() ?? ''

			const [categories, totalItems] = await this.prisma.$transaction([
				this.prisma.category.findMany({
					where: {
						OR: [
							{ name: { contains: trimedSearch, mode: 'insensitive' } },
							{
								subCategories: {
									some: {
										name: { contains: trimedSearch, mode: 'insensitive' },
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
						subCategories: true,
					},
				}),
				this.prisma.category.count({
					where: {
						OR: [
							{ name: { contains: trimedSearch, mode: 'insensitive' } },
							{
								subCategories: {
									some: {
										name: { contains: trimedSearch, mode: 'insensitive' },
									},
								},
							},
						],
						...filterOptions,
					},
				}),
			])

			return paginateResponse(query, categories, totalItems)
		} catch (err) {
			console.error(`Failed to fetch categories: ${err.message}`)
			throw new InternalServerErrorException(`Failed to fetch categories: ${err.message}`)
		}
	}

	async getCategoryById(categoryId: string) {
		try {
			const category = await this.prisma.category.findUnique({
				where: { id: categoryId },
				include: {
					subCategories: true,
				},
			})

			if (!category) {
				this.logger.warn(`Category with ID ${categoryId} not found`)
				throw new NotFoundException(`Category with ID ${categoryId} not found`)
			}

			return category
		} catch (error) {
			this.logger.error(`Failed to fetch category by ID: ${categoryId}`, error.stack)
			throw new InternalServerErrorException('Failed to fetch category')
		}
	}

	async createCategory(createCategoryDto: CreateCategoryDto) {
		const { name, subCategories } = createCategoryDto

		const existingCategory = await this.prisma.category.findFirst({ where: { name: name } })
		if (existingCategory) {
			throw new BadRequestException('Category already exists with name ' + name)
		}

		try {
			return await this.prisma.$transaction(async prisma => {
				const category = await prisma.category.create({
					data: {
						name,
					},
				})

				if (subCategories && subCategories.length > 0) {
					const subCategoryData = subCategories.map(subCategory => ({
						name: subCategory.name,
						categoryId: category.id,
					}))

					await prisma.subCategory.createMany({
						data: subCategoryData,
					})
				}

				return category
			})
		} catch (error) {
			this.logger.error(
				`Failed to create category with subcategories: ${error.message}`,
				error.stack,
			)
			throw new InternalServerErrorException('Failed to create category')
		}
	}

	async updateCategory(categoryId: string, updateCategoryDto: UpdateCategoryDto) {
		try {
			const category = await this.prisma.category.findUnique({
				where: { id: categoryId },
			})

			if (!category) {
				this.logger.warn(`Category with ID ${categoryId} not found for update`)
				throw new NotFoundException(`Category with ID ${categoryId} not found`)
			}

			const updatedCategory = await this.prisma.category.update({
				where: { id: categoryId },
				data: {
					name: updateCategoryDto.name,
				},
			})

			return updatedCategory
		} catch (error) {
			this.logger.error(`Failed to update category with ID: ${categoryId}`, error.stack)
			throw new InternalServerErrorException('Failed to update category')
		}
	}

	async deleteCategory(categoryId: string) {
		try {
			const category = await this.prisma.category.findUnique({
				where: { id: categoryId },
			})

			if (!category) {
				this.logger.warn(`Category with ID ${categoryId} not found for deletion`)
				throw new NotFoundException(`Category with ID ${categoryId} not found`)
			}

			await this.prisma.subCategory.deleteMany({
				where: {
					categoryId: categoryId,
				},
			})

			await this.prisma.category.delete({
				where: { id: categoryId },
			})
		} catch (error) {
			this.logger.error(`Failed to delete category with ID: ${categoryId}`, error.stack)
			throw new InternalServerErrorException('Failed to delete category')
		}
	}
}
