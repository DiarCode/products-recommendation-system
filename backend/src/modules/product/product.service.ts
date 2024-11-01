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

	async getAdvancedRecommendedProducts(userId: string): Promise<Product[]> {
		// Fetch recent history: viewed products, ordered items, and recent search terms
		const [viewedProducts, orders, searchTerms] = await Promise.all([
			this.prisma.visitedProduct.findMany({
				where: { userId },
				select: { productId: true, createdAt: true },
				orderBy: { createdAt: 'desc' },
			}),
			this.prisma.order.findMany({
				where: { userId },
				select: { id: true },
			}),
			this.prisma.searchTerm.findMany({
				where: { userId },
				select: { term: true },
				orderBy: { createdAt: 'desc' },
			}),
		])

		// Early exit if no history
		if (!viewedProducts.length && !orders.length) {
			return []
		}

		// Extract product IDs from viewed and ordered items
		const viewedProductIds = viewedProducts.map(item => item.productId)
		const ordersIds = orders.map(order => order.id)

		const orderedProducts = ordersIds.length
			? await this.prisma.orderItem.findMany({
					where: { orderId: { in: ordersIds } },
					select: { productId: true, price: true },
				})
			: []

		const orderedProductIds = orderedProducts.map(item => item.productId)
		const excludeProductIds = [...new Set([...viewedProductIds, ...orderedProductIds])]

		// Compute average price of ordered products for filtering
		const avgPrice =
			orderedProducts.reduce((sum, { price }) => sum + price, 0) / (orderedProducts.length || 1)

		// Content-based filtering based on viewed products' attributes
		const viewedProductDetails = await this.prisma.product.findMany({
			where: { id: { in: viewedProductIds } },
			include: { subCategory: true, brand: true, brandCategory: true },
		})

		const subCategories = Array.from(new Set(viewedProductDetails.map(item => item.subCategoryId)))
		const brands = Array.from(new Set(viewedProductDetails.map(item => item.brandId)))

		// Fetch content-based products that match user’s preferences
		const primaryProducts = await this.prisma.product.findMany({
			where: {
				subCategoryId: { in: subCategories },
				brandId: { in: brands },
				id: { notIn: excludeProductIds },
				price: { gte: avgPrice * 0.7, lte: avgPrice * 1.3 },
			},
			include: { subCategory: true, brand: true, brandCategory: true },
			orderBy: { ratingValue: 'desc' },
			take: 50,
		})

		// Enhance recommendations with products matching recent search terms
		const searchBasedProducts = await this.prisma.product.findMany({
			where: {
				OR: searchTerms.map(({ term }) => ({ name: { contains: term, mode: 'insensitive' } })),
				id: { notIn: excludeProductIds },
			},
			include: { subCategory: true, brand: true, brandCategory: true },
			take: 10,
		})

		// Consolidate product list and remove duplicates
		const uniqueProducts = [
			...new Map(
				[...primaryProducts, ...searchBasedProducts].map(product => [product.id, product]),
			).values(),
		]

		// Calculate the final score for each product
		let scoredProducts = await Promise.all(
			uniqueProducts.map(async product => ({
				...product,
				score: this.calculateProductFinalScore(product, viewedProducts, avgPrice),
			})),
		)

		// Sort by score
		scoredProducts = scoredProducts.sort((a, b) => b.score - a.score)

		// If fewer than 15 products, fetch additional similar products to fill the list
		if (scoredProducts.length < 15) {
			const additionalProducts = await this.prisma.product.findMany({
				where: {
					subCategoryId: { in: subCategories },
					OR: [
						{ brandId: { in: brands } },
						{ price: { gte: avgPrice * 0.7, lte: avgPrice * 1.3 } },
					],
					id: { notIn: excludeProductIds.concat(scoredProducts.map(p => p.id)) },
				},
				include: { subCategory: true, brand: true, brandCategory: true },
				orderBy: { ratingValue: 'desc' },
				take: 15 - scoredProducts.length,
			})

			// Score additional products and add to the list
			const scoredAdditionalProducts = await Promise.all(
				additionalProducts.map(async product => ({
					...product,
					score: this.calculateProductFinalScore(product, viewedProducts, avgPrice),
				})),
			)

			scoredProducts = scoredProducts
				.concat(scoredAdditionalProducts)
				.sort((a, b) => b.score - a.score)
		}

		// Return exactly 15 recommendations
		return scoredProducts.slice(0, 15)
	}

	private calculateCosineSimilarity(
		productA: Product,
		productB: { price: number; ratingValue: number; ratingCount: number },
	): number {
		const featureVectorA = [
			productA.price || 0,
			productA.ratingValue || 0,
			productA.ratingCount || 0,
		]

		const featureVectorB = [
			productB.price || 0,
			productB.ratingValue || 0,
			productB.ratingCount || 0,
		]

		const dotProduct = featureVectorA.reduce((sum, a, index) => sum + a * featureVectorB[index], 0)

		const magnitudeA = Math.hypot(...featureVectorA)
		const magnitudeB = Math.hypot(...featureVectorB)

		return magnitudeA && magnitudeB ? dotProduct / (magnitudeA * magnitudeB) : 0
	}

	// Final score calculation method incorporating cosine similarity and relevance factors
	private calculateProductFinalScore(
		product: Product,
		viewedProducts: { productId: string; createdAt: Date }[],
		avgPrice: number,
	): number {
		// Set scoring weights
		const priceWeight = 0.25
		const ratingWeight = 0.25
		const recencyWeight = 0.25
		const similarityWeight = 0.25

		// Calculate price similarity
		const priceScore = 1 - Math.abs(product.price - avgPrice) / avgPrice

		// Calculate recency score based on most recent view date
		const mostRecentView = viewedProducts.find(vp => vp.productId === product.id)?.createdAt
		const recencyScore = mostRecentView
			? Math.max(
					0,
					1 - (Date.now() - new Date(mostRecentView).getTime()) / (1000 * 60 * 60 * 24 * 30),
				) // 1-month decay
			: 0

		// Calculate cosine similarity to the most relevant viewed product
		const maxSimilarity = viewedProducts.reduce(maxSim => {
			const viewedProd = { price: avgPrice, ratingValue: 5, ratingCount: 10 } // Approximate representative viewed product
			const similarity = this.calculateCosineSimilarity(product, viewedProd)
			return Math.max(maxSim, similarity)
		}, 0)

		// Calculate rating score as normalized rating value
		const ratingScore = product.ratingValue / 5

		// Final score aggregation
		return (
			priceWeight * priceScore +
			ratingWeight * ratingScore +
			recencyWeight * recencyScore +
			similarityWeight * maxSimilarity
		)
	}
}
