export enum UserTypesEnum {
	INDIVIDUAL = 'INDIVIDUAL',
	LEGAL_ENTITY = 'LEGAL_ENTITY'
}

export interface User {
	firstName: string
	lastName: string
	phone: string
	userType: UserTypesEnum
	legalEntityName?: string
	bin_iin?: string
	role: Roles
}

export enum Roles {
	USER = 'USER',
	ADMIN = 'ADMIN'
}
