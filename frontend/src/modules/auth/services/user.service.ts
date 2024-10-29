import { UpdateUserDto } from '../models/users-dto.types'

import { fetchWrapper } from '@/core/api/fetch-instance'
import { environment } from '@/core/config/environment.config'

class UsersService {
	private readonly url = `/api/v1/users`

	async updateUser(dto: UpdateUserDto) {
		return fetchWrapper.put<void>(`${this.url}`, dto)
	}
}

export const usersService = new UsersService()
