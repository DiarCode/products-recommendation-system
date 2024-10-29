import { OrderStatus } from '@prisma/client'
import { Type } from 'class-transformer'
import { IsArray, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator'

export const ACTIVE_ORDER_STATUSES = [
	OrderStatus.PENDING,
	OrderStatus.CONFIRMED,
	OrderStatus.SHIPPED,
]

export interface CreateOrderItemPrisma {
	productId: string
	quantity: number
	price: number
	name: string
}

export class CreateOrderItemDto {
	@IsString()
	productId: string

	@IsNumber()
	quantity: number
}

export class CreateOrderDto {
	@IsOptional()
	@IsString()
	notes?: string

	@IsString()
	addressId: string

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	orderItems: CreateOrderItemDto[]
}

export class OrderAddress {
	@IsString()
	country: string

	@IsString()
	city: string

	@IsString()
	address: string
}

export class CreateAdminOrderDto {
	@IsOptional()
	@IsString()
	notes?: string

	@ValidateNested({ each: true })
	@Type(() => OrderAddress)
	address: OrderAddress

	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CreateOrderItemDto)
	orderItems: CreateOrderItemDto[]
}

class UpdateItemDto {
	@IsOptional()
	@IsString()
	productId?: string

	@IsOptional()
	@IsNumber()
	quantity?: number

	@IsOptional()
	@IsNumber()
	price?: number

	@IsOptional()
	@IsString()
	name?: string
}

export class UpdateOrderDto {
	@IsOptional()
	@IsString()
	addressId?: string

	@IsOptional()
	@IsEnum(OrderStatus)
	status?: OrderStatus

	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => UpdateItemDto)
	orderItems?: UpdateItemDto[]

	@IsOptional()
	@IsString()
	notes?: string
}
