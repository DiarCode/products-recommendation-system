import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { Product, ProductsStatus } from '@prisma/client'
import { nanoid } from 'nanoid'
import { PaginateQuery } from 'nestjs-paginate'
import { getFilterOptions } from 'src/utils/filter.utils'
import { PrismaService } from '../../database/prisma.service'
import { paginateResponse } from '../../utils/paginate-response.utils'
import { getPaginationMeta } from '../../utils/pagination.util'
import { getSortingOptions } from '../../utils/sorting.utils'
import { BrandCategoryService } from '../brand-category/brand-category.service'
import { ImagesService, PRODUCT_IMAGES_DIR } from '../images/images.service'
import { LoggerService } from '../logger/logger.service'
import { SubCategoryService } from '../sub-category/sub-category.service'
import { CreateProductDto, UpdateProductDto } from './product.dto'

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private imageService: ImagesService,
		private logger: LoggerService,
		private brandCategoryService: BrandCategoryService,
		private subCategoryService: SubCategoryService,
	) {}

	private async generateSKU(): Promise<string> {
		let sku: string
		let productWithSku: Product

		do {
			sku = `${nanoid(10).toUpperCase()}`
			productWithSku = await this.prisma.product.findFirst({
				where: { articul: sku },
			})
		} while (productWithSku)

		return sku
	}

	private async generateBarcode(): Promise<string> {
		let barcode: string
		let productWithBarcode: Product

		do {
			barcode = nanoid(12)
			productWithBarcode = await this.prisma.product.findFirst({
				where: { barcode: barcode },
			})
		} while (productWithBarcode)

		return barcode
	}

	async createProduct(createProductDto: CreateProductDto, files?: Express.Multer.File[]) {
		const { subCategoryId, brandCategoryId, name, description, characteristics, price, stock } =
			createProductDto

		const [subCategory, brandCategory, sku, barcode] = await Promise.all([
			this.subCategoryService.getSubCategoryById(subCategoryId),
			this.brandCategoryService.getBrandCategoryById(brandCategoryId),
			this.generateSKU(),
			this.generateBarcode(),
		])

		try {
			return await this.prisma.$transaction(async tx => {
				const product = await tx.product.create({
					data: {
						name,
						description,
						subCategoryId: subCategory.id,
						characteristics,
						brandId: brandCategory.brandId,
						brandCategoryId: brandCategory.id,
						articul: sku,
						barcode,
						price,
						stock,
						status: ProductsStatus.ACTIVE,
						images: [],
					},
				})

				if (files && files.length) {
					const imagePaths = await Promise.all(
						files.map(file => this.imageService.saveImage(file, PRODUCT_IMAGES_DIR)),
					)

					await tx.product.update({
						where: { id: product.id },
						data: { images: imagePaths },
					})
				}

				return product
			})
		} catch (err) {
			this.logger.error(`Failed to create product: ${err.message}`, err.stack)
			throw new InternalServerErrorException(`Failed to create product: ${err.message}`)
		}
	}

	async updateProduct(productId: string, dto: UpdateProductDto, files?: Express.Multer.File[]) {
		const { subCategoryId, brandCategoryId, imagesToDelete } = dto

		const product = await this.getProductById(productId)

		try {
			return await this.prisma.$transaction(async tx => {
				if (subCategoryId) {
					await this.subCategoryService.getSubCategoryById(subCategoryId)
				}
				if (brandCategoryId) {
					const brandCategory =
						await this.brandCategoryService.getBrandCategoryById(brandCategoryId)
					dto.brandId = brandCategory.brandId
					dto.brandCategoryId = brandCategory.id
				}

				if (imagesToDelete && imagesToDelete.length > 0) {
					await Promise.all(
						imagesToDelete.map(async imagePath => {
							await this.imageService.deleteImage(imagePath, PRODUCT_IMAGES_DIR)
							product.images = product.images.filter(image => image !== imagePath)
						}),
					)
				}

				if (files && files.length > 0) {
					const newImagePaths = await Promise.all(
						files.map(file => this.imageService.saveImage(file, PRODUCT_IMAGES_DIR)),
					)
					product.images = [...product.images, ...newImagePaths]
				}

				const updatedProduct = await tx.product.update({
					where: { id: productId },
					data: {
						name: dto.name || product.name,
						description: dto.description || product.description,
						subCategoryId: dto.subCategoryId || product.subCategoryId,
						characteristics: dto.characteristics || product.characteristics,
						brandId: dto.brandId || product.brandId,
						brandCategoryId: dto.brandCategoryId || product.brandCategoryId,
						images: product.images,
						price: dto.price ?? product.price,
						stock: dto.stock ?? product.stock,
						status: dto.status || product.status,
					},
				})

				return updatedProduct
			})
		} catch (err) {
			this.logger.error(`Failed to update product: ${err.message}`, err.stack)
			throw new InternalServerErrorException(`Failed to update product: ${err.message}`)
		}
	}

	async getPaginatedProducts(query: PaginateQuery) {
		try {
			const { search, sortBy, filter } = query

			const filterOptions = getFilterOptions<Product>(filter)
			const sortingOptions = getSortingOptions<Product>(sortBy, {
				createdAt: 'desc',
			})
			const paginationMeta = getPaginationMeta(query)

			const trimmedSearch = search?.trim() ?? ''

			const [products, totalItems] = await Promise.all([
				this.prisma.product.findMany({
					skip: paginationMeta.skip,
					take: paginationMeta.take,
					where: {
						OR: [
							{ name: { contains: trimmedSearch, mode: 'insensitive' } },
							{ articul: { contains: trimmedSearch, mode: 'insensitive' } },
							{ barcode: { contains: trimmedSearch, mode: 'insensitive' } },
						],
						...filterOptions,
					},
					orderBy: sortingOptions,
					include: {
						subCategory: true,
						brand: true,
						brandCategory: true,
					},
				}),
				this.prisma.product.count({
					where: {
						OR: [
							{ name: { contains: trimmedSearch, mode: 'insensitive' } },
							{ articul: { contains: trimmedSearch, mode: 'insensitive' } },
							{ barcode: { contains: trimmedSearch, mode: 'insensitive' } },
						],
						...filterOptions,
					},
				}),
			])

			return paginateResponse(query, products, totalItems)
		} catch (err) {
			this.logger.error(`Failed to fetch products: ${err.message}`, err.stack)
			throw new InternalServerErrorException(`Failed to fetch products: ${err.message}`)
		}
	}

	async getAllProducts() {
		return this.prisma.product.findMany()
	}

	async getProductById(id: string) {
		const product = await this.prisma.product.findFirst({
			where: { id, status: { not: ProductsStatus.ARCHIVED } },
			include: {
				subCategory: true,
				brand: true,
				brandCategory: true,
			},
		})

		if (!product) {
			throw new NotFoundException(`Product with ID ${id} not found`)
		}

		return product
	}

	async getProductByIds(productIds: string) {
		const idsArray = productIds.split(',').map(id => id.trim())

		if (idsArray.length === 0 || idsArray.some(id => !id)) {
			throw new BadRequestException('Invalid product IDs provided.')
		}

		const products = await this.prisma.product.findMany({
			where: {
				id: { in: idsArray },
				status: { not: ProductsStatus.ARCHIVED },
			},
			include: {
				brand: true,
				brandCategory: true,
				subCategory: true,
			},
		})

		if (products.length === 0) {
			throw new BadRequestException('No products found for the given IDs.')
		}

		return products
	}

	async getHistoryProductsByUser(userId: string) {
		const products = await this.prisma.orderItem.findMany({
			where: {
				order: {
					userId,
				},
			},
			select: {
				product: { include: { brand: true, 'subCategory': true } },
			},
			distinct: ['productId'],
		})

		return products.map(item => item.product)
	}

	async addSearchTerm(userId: string, term: string): Promise<void> {
		await this.prisma.$transaction(async prisma => {
			await prisma.searchTerm.create({
				data: {
					term,
					userId,
				},
			})

			const excessSearchTerms = await prisma.searchTerm.findMany({
				where: { userId },
				orderBy: { createdAt: 'desc' },
				skip: 10,
				select: { id: true },
			})

			if (excessSearchTerms.length > 0) {
				const idsToDelete = excessSearchTerms.map(term => term.id)
				await prisma.searchTerm.deleteMany({
					where: { id: { in: idsToDelete } },
				})
			}
		})
	}

	async addVisitedProduct(userId: string, productId: string): Promise<void> {
		await this.prisma.$transaction(async prisma => {
			await prisma.visitedProduct.create({
				data: {
					productId,
					userId,
				},
			})

			const excessVisitedProducts = await prisma.visitedProduct.findMany({
				where: { userId },
				orderBy: { createdAt: 'desc' },
				skip: 10,
				select: { id: true },
			})

			if (excessVisitedProducts.length > 0) {
				const idsToDelete = excessVisitedProducts.map(product => product.id)
				await prisma.visitedProduct.deleteMany({
					where: { id: { in: idsToDelete } },
				})
			}
		})
	}

	async getRecommendedProductsByUser(userId: string) {
		// get viewed products by the user
		const viewedProducts = await this.prisma.visitedProduct.findMany({
			where: { userId },
			select: { productId: true },
		});

		// If the user has no view history => return top-rated products
		if (viewedProducts.length === 0) {
			const topRatedProducts = await this.prisma.product.findMany({
				orderBy: { ratingValue: 'desc' },
				take: 10,
			});
			return topRatedProducts;
		}

		// get user's orders
		const orders = await this.prisma.order.findMany({
			where: { userId: userId },
			select: { orderItemsId: true },
			take: 10,
		});

		const orderItemsIds = orders.flatMap(item => item.orderItemsId);

		let orderedProducts = [];
		if (orderItemsIds.length > 0) {
			orderedProducts = await this.prisma.orderItem.findMany({
				where: { id: { in: orderItemsIds } },
				select: { productId: true },
			});
		}

		const viewedProductIds = viewedProducts.map(item => item.productId);
		const orderedProductIds = orderedProducts.map(item => item.productId);
		const excludeProductIds = [...viewedProductIds, ...orderedProductIds];

		const viewedDetails = await this.prisma.product.findMany({
			where: { id: { in: viewedProductIds } },
			select: { subCategoryId: true, brandId: true },
		});

		const subCategories = Array.from(new Set(viewedDetails.map(item => item.subCategoryId)));
		const brands = Array.from(new Set(viewedDetails.map(item => item.brandId)));

		const orderedProductDetails = await this.prisma.product.findMany({
			where: { id: { in: orderedProductIds } },
			select: { price: true },
		});

		// Calculate the average price if the user has made orders
		const averagePrice = orderedProductDetails.length > 0
			? orderedProductDetails.reduce((sum, product) => sum + product.price, 0) / orderedProductDetails.length
			: 0;

		// Fetch products with filtering based on subcategories and brands
		const products = await this.prisma.product.findMany({
			where: {
				subCategoryId: { in: subCategories },
				brandId: { in: brands },
				id: { notIn: excludeProductIds },
			},
			orderBy: { ratingValue: 'desc' },
			take: 30,
		});

		// sorting by price difference
		const sortedProducts = products
			.map(product => ({
				...product,
				priceDifference: Math.abs(product.price - averagePrice),
			}))
			.sort((a, b) => {
				return a.priceDifference - b.priceDifference;
			})
			.slice(0, 10);

		return sortedProducts;
	}
}