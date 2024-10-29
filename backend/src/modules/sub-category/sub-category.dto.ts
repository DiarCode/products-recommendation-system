import { Type } from 'class-transformer'
import {
	ArrayNotEmpty,
	IsArray,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator'

class CreateSubCategoryDto {
	@IsString({ message: 'Имя подкатегории должно быть строкой' })
	@IsNotEmpty({ message: 'Имя подкатегории не может быть пустым' })
	name: string
}

export class CreateSubCategoriesDto {
	@IsArray({ message: 'Подкатегории должны быть массивом' })
	@ArrayNotEmpty({ message: 'Должна быть хотя бы одна подкатегория' })
	@ValidateNested({ each: true, message: 'Неверные данные подкатегории' })
	@Type(() => CreateSubCategoryDto)
	subCategories: CreateSubCategoryDto[]

	@IsString({ message: 'ID категории должно быть строкой' })
	@IsNotEmpty({ message: 'ID категории не может быть пустым' })
	categoryId: string
}

export class UpdateSubCategoryDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	categoryId?: string
}
