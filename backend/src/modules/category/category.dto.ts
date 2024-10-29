import { IsOptional, IsString } from 'class-validator'

class CreateSubCategoryDto {
	@IsString()
	name: string
}

export class CreateCategoryDto {
	@IsString()
	name: string

	@IsOptional()
	subCategories?: CreateSubCategoryDto[]
}

export class UpdateCategoryDto {
	@IsOptional()
	@IsString()
	name?: string
}
