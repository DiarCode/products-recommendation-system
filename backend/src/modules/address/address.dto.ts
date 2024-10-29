import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateAddressDto {
	@IsString()
	@IsNotEmpty()
	address: string

	@IsString()
	@IsNotEmpty()
	city: string

	@IsString()
	@IsNotEmpty()
	country: string
}

export class UpdateAddressDto {
	@IsString()
	@IsOptional()
	address?: string

	@IsString()
	@IsOptional()
	city?: string

	@IsString()
	@IsOptional()
	country?: string
}
