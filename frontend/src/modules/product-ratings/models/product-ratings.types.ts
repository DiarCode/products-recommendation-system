import { User } from '@/modules/users/models/users.types'

export interface ProductRating {
	id: string
	productId: string
	userId: string
	rating: number
	comment?: string
	createdAt: Date
	user: User
}

export interface CreateRatingDto {
	productId: string
	rating: number
	comment?: string
}

export interface CheckUserCanRateResponse {
	canRate: boolean
	rating?: ProductRating
}
