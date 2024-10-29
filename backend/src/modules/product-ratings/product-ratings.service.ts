import {
	ConflictException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { CreateRatingDto } from './product-ratings-dto.types'

@Injectable()
export class ProductRatingsService {
	constructor(private prisma: PrismaService) {}

	async createRating(dto: CreateRatingDto, userId: string) {
		const { productId, rating, comment } = dto

		return this.prisma.$transaction(async prisma => {
			const product = await prisma.product.findUnique({
				where: { id: productId },
				select: { id: true, ratingValue: true, ratingCount: true },
			})

			if (!product) {
				throw new NotFoundException('Product not found')
			}

			const existingRating = await prisma.productRating.findFirst({
				where: {
					userId,
					productId,
				},
				select: { id: true },
			})

			if (existingRating) {
				throw new ConflictException('User has already rated this product')
			}

			const productRating = await prisma.productRating.create({
				data: {
					productId,
					userId,
					rating,
					comment,
				},
			})

			const newRatingValue =
				(product.ratingValue * product.ratingCount + rating) / (product.ratingCount + 1)

			await prisma.product.update({
				where: { id: productId },
				data: {
					ratingValue: newRatingValue,
					ratingCount: product.ratingCount + 1,
				},
			})

			return productRating
		})
	}

	async getRatingsForProduct(productId: string) {
		const ratings = await this.prisma.productRating.findMany({
			where: {
				productId,
				comment: { not: null },
			},
			include: {
				user: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return ratings
	}

	async checkIfUserCanRate(productId: string, userId: string) {
		try {
			const orderWithProduct = await this.prisma.order.findFirst({
				where: {
					userId: userId,
					orderItems: {
						some: { productId: productId }, // Ensure the product is part of the order items
					},
				},
				select: {
					id: true,
				},
			})

			if (!orderWithProduct) {
				return { canRate: false, message: 'User has not ordered this product' }
			}

			const existingRating = await this.prisma.productRating.findFirst({
				where: {
					userId: userId,
					productId: productId,
				},
			})

			if (existingRating) {
				return {
					canRate: false,
					rating: existingRating,
				}
			}

			return {
				canRate: true,
			}
		} catch {
			throw new InternalServerErrorException(
				'An error occurred while checking if the user can rate the product',
			)
		}
	}

	async getRatingsByUser(userId: string) {
		const ratings = await this.prisma.productRating.findMany({
			where: {
				userId,
			},
			include: {
				user: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return ratings
	}
}
