import { UserTypesEnum } from '@/modules/users/models/users.types'

export interface LoginDTO {
	phone: string
	password: string
}

export interface SignupDTO {
	firstName: string
	lastName: string
	phone: string
	password: string
	userType: UserTypesEnum
	legalEntityName?: string
	bin_iin?: string
}

export enum Tokens {
	ACCESS = 'accessToken',
	REFRESH = 'refreshToken'
}
