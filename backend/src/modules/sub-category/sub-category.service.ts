import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common'
import { SubCategory } from '@prisma/client'
import { PaginateQuery } from 'nestjs-paginate'
import { getFilterOptions } from 'src/utils/filter.utils'
import { paginateResponse } from 'src/utils/paginate-response.utils'
import { getPaginationMeta } from 'src/utils/pagination.util'
import { PrismaService } from '../../database/prisma.service'
import { CategoryService } from '../category/category.service'
import { LoggerService } from '../logger/logger.service'
import { CreateSubCategoriesDto, UpdateSubCategoryDto } from './sub-category.dto'

@Injectable()
export class SubCategoryService {
	constructor(
		private prisma: PrismaService,
		private logger: LoggerService,
		private categoryService: CategoryService,
	) {}

	async getAllSubCategories() {
		try {
			const subCategories = await this.prisma.subCategory.findMany({
				include: {
					category: true,
				},
			})
			return subCategories
		} catch (error) {
			this.logger.error(`Failed to fetch subcategories: ${error.message}`, error.stack)
			throw new InternalServerErrorException('Failed to fetch subcategories')
		}
	}

	async getSubCategoriesPageable(query: PaginateQuery) {
		try {
			const filterOptions = getFilterOptions<SubCategory>(query.filter)
			const paginationMeta = getPaginationMeta(query)

			const trimmedSearch = query.search?.trim() ?? ''

			const [orders, totalItems] = await this.prisma.$transaction([
				this.prisma.subCategory.findMany({
					where: {
						OR: [{ name: { contains: trimmedSearch, mode: 'insensitive' } }],
						...filterOptions,
					},
					skip: paginationMeta.skip,
					take: paginationMeta.take,
					orderBy: { createdAt: 'desc' },
				}),
				this.prisma.subCategory.count({
					where: {
						OR: [{ name: { contains: trimmedSearch, mode: 'insensitive' } }],

						...filterOptions,
					},
				}),
			])

			return paginateResponse(query, orders, totalItems)
		} catch (err) {
			console.error(`Failed to fetch sub-categories: ${err.message}`)
			throw new InternalServerErrorException(`Failed to fetch sub-categories: ${err.message}`)
		}
	}

	async getSubCategoryById(id: string) {
		try {
			const subCategory = await this.prisma.subCategory.findUnique({
				where: { id },
				include: {
					category: true,
				},
			})

			if (!subCategory) {
				this.logger.warn(`SubCategory with ID ${id} not found`)
				throw new NotFoundException('SubCategory not found')
			}

			return subCategory
		} catch (error) {
			this.logger.error(`Failed to fetch subcategory by ID: ${id}`, error.stack)
			throw new InternalServerErrorException('Failed to fetch subcategory')
		}
	}

	async createSubCategories(dto: CreateSubCategoriesDto) {
		const { subCategories, categoryId } = dto

		try {
			const category = await this.categoryService.getCategoryById(categoryId)

			return await this.prisma.$transaction(async prisma => {
				const subCategoryData = subCategories.map(subCategory => ({
					name: subCategory.name,
					categoryId: category.id,
				}))

				const createdSubCategories = await prisma.subCategory.createMany({
					data: subCategoryData,
				})

				return createdSubCategories
			})
		} catch (error) {
			this.logger.error(
				`Failed to create subcategories for category ${categoryId}: ${error.message}`,
				error.stack,
			)
			throw new InternalServerErrorException('Failed to create subcategories')
		}
	}

	async updateSubCategory(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
		const { name, categoryId } = updateSubCategoryDto

		try {
			const subCategory = await this.getSubCategoryById(id)

			if (categoryId) {
				const category = await this.categoryService.getCategoryById(categoryId)
				subCategory.categoryId = category.id
			}

			if (name) {
				subCategory.name = name
			}

			const updatedSubCategory = await this.prisma.subCategory.update({
				where: { id },
				data: {
					name: subCategory.name,
					categoryId: subCategory.categoryId,
				},
			})

			return updatedSubCategory
		} catch (error) {
			this.logger.error(`Failed to update subcategory with ID: ${id}`, error.stack)
			throw new InternalServerErrorException('Failed to update subcategory')
		}
	}

	async deleteSubCategory(id: string) {
		try {
			const subCategory = await this.getSubCategoryById(id)

			await this.prisma.subCategory.delete({
				where: { id: subCategory.id },
			})
		} catch (error) {
			this.logger.error(`Failed to delete subcategory with ID: ${id}`, error.stack)
			throw new InternalServerErrorException('Failed to delete subcategory')
		}
	}
}
