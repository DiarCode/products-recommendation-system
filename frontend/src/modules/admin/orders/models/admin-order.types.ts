export interface CreateOrderItemDto {
	productId: string
	quantity: number
}

export interface CreateAdminOrderDto {
	address: {
		city: string
		country: string
		address: string
	}
	orderItems: CreateOrderItemDto[]
	notes?: string
}
