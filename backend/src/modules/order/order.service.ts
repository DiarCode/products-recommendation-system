import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	NotFoundException,
} from '@nestjs/common'
import { Order, OrderStatus } from '@prisma/client'
import { PaginateQuery } from 'nestjs-paginate'
import { getFilterOptions } from 'src/utils/filter.utils'
import { paginateResponse } from 'src/utils/paginate-response.utils'
import { getSortingOptions } from 'src/utils/sorting.utils'
import { PrismaService } from '../../database/prisma.service'
import { getPaginationMeta } from '../../utils/pagination.util'
import { ProductService } from '../product/product.service'
import { UserService } from '../user/user.service'
import { AddressService } from './../address/address.service'
import {
	ACTIVE_ORDER_STATUSES,
	CreateAdminOrderDto,
	CreateOrderDto,
	CreateOrderItemPrisma,
	UpdateOrderDto,
} from './order.dto'

@Injectable()
export class OrderService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
		private addressService: AddressService,
		private productService: ProductService,
	) {}

	async createOrder(userId: string, dto: CreateOrderDto) {
		const { addressId, orderItems, notes } = dto

		const user = await this.userService.getUserById(userId)

		const address = await this.addressService.getAddressByIdAndUser(user.id, addressId)

		let totalPrice = 0
		const orderItemsData: CreateOrderItemPrisma[] = []

		return await this.prisma.$transaction(
			async tx => {
				for (const item of orderItems) {
					const product = await tx.product.findFirst({
						where: { id: item.productId },
					})

					if (!product) {
						throw new NotFoundException(`Product with id ${item.productId} not found`)
					}

					if (product.stock < item.quantity) {
						throw new BadRequestException(`Not enough stock for product: ${product.name}`)
					}

					const itemPrice = product.price * item.quantity
					totalPrice += itemPrice

					orderItemsData.push({
						productId: item.productId,
						quantity: item.quantity,
						price: product.price,
						name: product.name,
					})

					await tx.product.update({
						where: { id: item.productId },
						data: {
							stock: { decrement: item.quantity },
						},
					})
				}

				const createdOrder = await tx.order.create({
					data: {
						notes: notes,
						userId: user.id,
						address: {
							country: address.country,
							city: address.city,
							address: address.address,
						},
						totalPrice: Math.round(totalPrice * 100) / 100,
						status: OrderStatus.PENDING,
						isPaid: false,
						orderItems: {
							create: orderItemsData,
						},
					},
				})

				return createdOrder
			},
			{
				maxWait: 5000,
				timeout: 10000,
			},
		)
	}

	async createAdminOrder(userId: string, dto: CreateAdminOrderDto) {
		const { address, orderItems, notes } = dto

		const user = await this.userService.getUserById(userId)

		return await this.prisma.$transaction(async tx => {
			let totalPrice = 0
			const orderItemsData: CreateOrderItemPrisma[] = []

			for (const item of orderItems) {
				const product = await tx.product.findUnique({
					where: { id: item.productId },
				})

				if (!product) {
					throw new NotFoundException(`Product with id ${item.productId} not found`)
				}

				if (product.stock < item.quantity) {
					throw new BadRequestException(`Not enough stock for product: ${product.name}`)
				}

				const itemPrice = product.price * item.quantity
				totalPrice += itemPrice

				orderItemsData.push({
					productId: item.productId,
					quantity: item.quantity,
					price: product.price,
					name: product.name,
				})

				await tx.product.update({
					where: { id: item.productId },
					data: {
						stock: product.stock - item.quantity,
					},
				})
			}

			const createdOrder = await tx.order.create({
				data: {
					notes: notes,
					userId: user.id,
					address: {
						country: address.country,
						city: address.city,
						address: address.address,
					},
					totalPrice: Math.round(totalPrice * 100) / 100,
					status: OrderStatus.PENDING,
					isPaid: false,
					orderItems: {
						create: orderItemsData,
					},
				},
			})

			return createdOrder
		})
	}

	async getMyOrders(query: PaginateQuery, userId: string) {
		try {
			const sortingOptions = getSortingOptions<Order>(query.sortBy, { createdAt: 'desc' })
			const paginationMeta = getPaginationMeta(query)

			const [orders, totalItems] = await Promise.all([
				this.prisma.order.findMany({
					skip: paginationMeta.skip,
					take: paginationMeta.take,
					where: {
						userId: userId,
					},
					orderBy: sortingOptions,
					include: {
						orderItems: {
							include: {
								product: true,
							},
						},
						user: true,
					},
				}),
				this.prisma.order.count({
					where: {},
				}),
			])

			return paginateResponse(query, orders, totalItems)
		} catch (err) {
			console.error(`Failed to fetch orders: ${err.message}`)
			throw new InternalServerErrorException(`Failed to fetch orders: ${err.message}`)
		}
	}

	async getOrderDetails(orderId: string) {
		const order = await this.prisma.order.findUnique({
			where: { id: orderId },
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
				user: true,
			},
		})

		if (!order) {
			throw new NotFoundException(`Order with id ${orderId} not found`)
		}

		return order
	}

	async getMyOrderDetails(orderId: string, userId: string) {
		const order = await this.prisma.order.findFirst({
			where: {
				id: orderId,
				userId: userId,
			},
			include: {
				orderItems: {
					include: {
						product: true,
					},
				},
				user: true,
			},
		})

		if (!order) {
			throw new NotFoundException(
				`Order with id ${orderId} not found or does not belong to the user`,
			)
		}

		return order
	}

	async getAllOrders(query: PaginateQuery) {
		try {
			const filterOptions = getFilterOptions<Order>(query.filter)
			const sortingOptions = getSortingOptions<Order>(query.sortBy, { createdAt: 'desc' })
			const paginationMeta = getPaginationMeta(query)

			if (filterOptions.status === 'ALL') {
				filterOptions.status = undefined
			} else if (filterOptions.status === 'ACTIVE') {
				filterOptions.status = { in: ACTIVE_ORDER_STATUSES }
			}

			filterOptions.isPaid = filterOptions.isPaid === 'true'

			const trimedSearch = query.search?.trim() ?? ''

			const [orders, totalItems] = await this.prisma.$transaction([
				this.prisma.order.findMany({
					skip: paginationMeta.skip,
					take: paginationMeta.take,
					where: {
						OR: [
							{
								orderItems: {
									some: { product: { name: { contains: trimedSearch, mode: 'insensitive' } } },
								},
							},
							{
								orderItems: {
									some: { product: { barcode: { contains: trimedSearch, mode: 'insensitive' } } },
								},
							},
							{
								orderItems: {
									some: { product: { articul: { contains: trimedSearch, mode: 'insensitive' } } },
								},
							},
						],
						...filterOptions,
					},
					orderBy: sortingOptions,
					include: {
						orderItems: true,
						user: true,
					},
				}),
				this.prisma.order.count({
					where: {
						OR: [
							{
								orderItems: {
									some: { product: { name: { contains: trimedSearch, mode: 'insensitive' } } },
								},
							},
							{
								orderItems: {
									some: { product: { barcode: { contains: trimedSearch, mode: 'insensitive' } } },
								},
							},
							{
								orderItems: {
									some: { product: { articul: { contains: trimedSearch, mode: 'insensitive' } } },
								},
							},
						],
						...filterOptions,
					},
				}),
			])

			return paginateResponse(query, orders, totalItems)
		} catch (err) {
			console.error(`Failed to fetch orders: ${err.message}`)
			throw new InternalServerErrorException(`Failed to fetch orders: ${err.message}`)
		}
	}

	async updateOrder(orderId: string, dto: UpdateOrderDto) {
		const { addressId, status, orderItems } = dto

		return this.prisma.$transaction(async tx => {
			const order = await tx.order.findUnique({
				where: { id: orderId },
				include: { orderItems: true },
			})
			if (!order) {
				throw new BadRequestException('Order not found')
			}

			let addressToUpdate = order.address
			if (addressId) {
				const newAddress = await this.addressService.getAddressByIdAndUser(order.userId, addressId)
				addressToUpdate = newAddress
			}
			let updatedItems = []
			let totalPrice = order.totalPrice
			if (orderItems && orderItems.length > 0) {
				updatedItems = await Promise.all(
					orderItems.map(async item => {
						const product = await this.productService.getProductById(item.productId)

						const existingItem = order.orderItems.find(i => i.productId === item.productId)
						const stockChange = existingItem ? item.quantity - existingItem.quantity : item.quantity

						if (product.stock < stockChange) {
							throw new BadRequestException(`Not enough stock for product: ${product.name}`)
						}

						await tx.product.update({
							where: { id: item.productId },
							data: { stock: { decrement: stockChange } },
						})

						if (existingItem) {
							return tx.orderItem.update({
								where: { id: existingItem.id },
								data: {
									quantity: item.quantity,
									price: item.price,
								},
							})
						} else {
							return tx.orderItem.create({
								data: {
									orderId,
									productId: item.productId,
									quantity: item.quantity,
									price: item.price,
									name: item.name,
								},
							})
						}
					}),
				)

				totalPrice = updatedItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
			}

			const updatedOrder = await tx.order.update({
				where: { id: orderId },
				data: {
					notes: dto.notes || order.notes,
					status: status || order.status,
					address: addressToUpdate,
					...(updatedItems.length > 0 && {
						orderItemsId: updatedItems.map(item => item.id),
						totalPrice,
					}),
				},
				include: { orderItems: true },
			})

			return updatedOrder
		})
	}
}
