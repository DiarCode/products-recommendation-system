import { IsOptional, IsString } from 'class-validator'

class CreateBrandCategoryDto {
	@IsString()
	name: string
}

export class CreateBrandDto {
	@IsString()
	name: string

	@IsOptional()
	@IsString()
	description: string

	@IsOptional()
	@IsString()
	url: string

	@IsOptional()
	brandCategories?: CreateBrandCategoryDto[]
}

export class UpdateBrandDto {
	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	description?: string

	@IsOptional()
	@IsString()
	url?: string
}
