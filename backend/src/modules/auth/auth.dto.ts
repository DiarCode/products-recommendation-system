import { IsString, Matches, MinLength } from 'class-validator'

export class LoginDto {
	@IsString()
	@Matches(/^(\+7|8)[0-9]{10}$/, {
		message: 'Phone number must start with +7 or 8 and contain 11 digits',
	})
	phone: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string
}

export class CreateUserDto {
	@IsString()
	firstName: string

	@IsString()
	lastName: string

	@MinLength(6, {
		message: 'Password must be at least 6 characters long',
	})
	@IsString()
	password: string

	@IsString()
	@Matches(/^(\+7|8)[0-9]{10}$/, {
		message: 'Phone number must start with +7 or 8 and contain 11 digits',
	})
	phone: string
}
