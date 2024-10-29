import { ProductsStatus } from '@prisma/client'
import { Transform } from 'class-transformer'
import {
	IsArray,
	IsEnum,
	IsNotEmpty,
	IsNumber,
	IsObject,
	IsOptional,
	IsString,
	Min,
} from 'class-validator'

export class CreateProductDto {
	@IsNotEmpty()
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description: string

	@IsNotEmpty()
	@IsString()
	subCategoryId: string

	@IsOptional()
	@Transform(({ value }) => {
		try {
			return JSON.parse(value)
		} catch (error) {
			console.error('Error parsing JSON:', error)
			return value
		}
	})
	@IsObject()
	characteristics: Record<string, string>

	@IsOptional()
	@IsString()
	brandCategoryId: string

	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	images?: string[]

	@IsNotEmpty()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	price: number

	@IsNotEmpty()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@Min(1)
	stock: number
}

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	subCategoryId?: string

	@IsOptional()
	@Transform(({ value }) => {
		try {
			return JSON.parse(value)
		} catch (error) {
			console.error('Error parsing JSON:', error)
			return value
		}
	})
	@IsObject()
	characteristics?: Record<string, any>

	@IsOptional()
	@IsString()
	brandId?: string

	@IsOptional()
	@IsEnum(ProductsStatus)
	status?: ProductsStatus

	@IsOptional()
	@IsString()
	brandCategoryId?: string

	@IsOptional()
	@Transform(({ value }) => {
		try {
			return typeof value === 'string' ? JSON.parse(value) : value
		} catch {
			return value
		}
	})
	@IsArray()
	@IsString({ each: true })
	imagesToDelete?: string[]

	@IsOptional()
	@IsString()
	articul?: string

	@IsOptional()
	@IsString()
	barcode?: string

	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@Min(1)
	price?: number

	@IsOptional()
	@Transform(({ value }) => parseFloat(value))
	@IsNumber()
	@Min(1)
	stock?: number
}
