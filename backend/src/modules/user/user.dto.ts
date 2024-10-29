import { Role } from '@prisma/client'
import { IsEnum, IsOptional, IsString, Matches, MinLength } from 'class-validator'

export class UpdateUserDto {
	@IsOptional()
	@IsString()
	firstName?: string

	@IsOptional()
	@IsString()
	lastName?: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@IsString()
	oldPassword?: string

	@IsString()
	@IsOptional()
	@Matches(/^(\+7|8)[0-9]{10}$/, {
		message: 'Phone number must start with +7 or 8 and contain 11 digits',
	})
	phone?: string

	@IsOptional()
	@IsOptional()
	@IsEnum(Role, {
		message: 'role must be either USER or ADMIN',
	})
	role: Role
}

export interface UserProfileDTO {
	id: string
	firstName: string
	lastName: string
	phone: string
	createdAt: Date
	updatedAt: Date
	role: Role
}
