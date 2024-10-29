import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

class CreateBrandCategoryDto {
	@IsString({ message: 'Имя категории должно быть строкой' })
	@IsNotEmpty({ message: 'Имя категории не может быть пустым' })
	name: string
}

export class CreateBrandCategoriesDto {
	@IsArray({ message: 'Категории должны быть массивом' })
	@ArrayNotEmpty({ message: 'Должна быть хотя бы одна категория' })
	@ValidateNested({ each: true, message: 'Неверные данные категории' })
	@Type(() => CreateBrandCategoryDto)
	brandCategories: CreateBrandCategoryDto[]

	@IsString({ message: 'ID бренда должно быть строкой' })
	@IsNotEmpty({ message: 'ID бренда не может быть пустым' })
	brandId: string
}

export class UpdateBrandCategoryDto {
	@IsOptional()
	@IsString()
	name?: string
}
