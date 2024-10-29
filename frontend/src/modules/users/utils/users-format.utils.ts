import { User } from '../models/users.types'

export const getUserFullName = (user: User) => {
	return `${user.firstName} ${user.lastName}`.trim()
}

export const getUserInitials = (user: User) => {
	return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.trim()
}
