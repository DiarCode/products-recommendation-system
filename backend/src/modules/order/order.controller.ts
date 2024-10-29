import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common'
import { Role } from '@prisma/client'
import { Paginate, PaginateQuery } from 'nestjs-paginate'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { Roles } from '../auth/roles/roles.decorator'
import { CreateAdminOrderDto, CreateOrderDto, UpdateOrderDto } from './order.dto'
import { OrderService } from './order.service'

@Controller('orders')
export class OrderController {
	constructor(private readonly ordersService: OrderService) {}

	@Post()
	@Auth()
	async createOrder(@CurrentUser('id') userId: string, @Body() createOrderDto: CreateOrderDto) {
		return this.ordersService.createOrder(userId, createOrderDto)
	}

	@Post('/admin')
	@Roles(Role.ADMIN)
	@Auth()
	async createOrderAdmin(@CurrentUser('id') userId: string, @Body() dto: CreateAdminOrderDto) {
		return this.ordersService.createAdminOrder(userId, dto)
	}

	@Get('my-orders')
	@Auth()
	async getMyOrders(@Paginate() query: PaginateQuery, @CurrentUser('id') userId: string) {
		return this.ordersService.getMyOrders(query, userId)
	}

	@Roles(Role.ADMIN)
	@Get(':orderId')
	async getOrderDetails(@Param('orderId') orderId: string) {
		return this.ordersService.getOrderDetails(orderId)
	}

	@Get('my/:orderId')
	@Auth()
	async getMyOrderDetails(@Param('orderId') orderId: string, @CurrentUser('id') userId: string) {
		return this.ordersService.getMyOrderDetails(orderId, userId)
	}

	@Roles(Role.ADMIN)
	@Get()
	async getAllOrders(@Paginate() query: PaginateQuery) {
		return this.ordersService.getAllOrders(query)
	}

	@Roles(Role.ADMIN)
	@Put(':orderId')
	async updateOrder(@Param('orderId') orderId: string, @Body() updateOrderDto: UpdateOrderDto) {
		return this.ordersService.updateOrder(orderId, updateOrderDto)
	}
}
