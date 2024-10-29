export interface CreateAddressDto {
	address: string
	city: string
	country: string
}

export interface UpdateAddressDto {
	id: string
	address?: string
	city?: string
	country?: string
}
