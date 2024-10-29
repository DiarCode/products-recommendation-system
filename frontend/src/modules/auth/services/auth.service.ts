import { LoginDTO, SignupDTO, Tokens } from '../models/auth-dto.types'

import { RequestOptions, fetchWrapper } from '@/core/api/fetch-instance'
import { User } from '@/modules/users/models/users.types'

class AuthService {
	private readonly url = `/api/v1/auth`

	async login(dto: LoginDTO, options?: RequestOptions) {
		return fetchWrapper.post<void>(`${this.url}/login`, dto, options)
	}

	async signup(dto: SignupDTO, options?: RequestOptions) {
		return fetchWrapper.post<void>(`${this.url}/register`, dto, options)
	}

	async logout(options?: RequestOptions) {
		return fetchWrapper.get(`${this.url}/logout`, options)
	}

	async getCurrent(options?: RequestOptions) {
		return fetchWrapper
			.get<User>(`${this.url}/current`, options)
			.catch(() => null)
	}

	async getCurrentWithToken(token?: string) {
		const options: RequestOptions | undefined = token
			? {
					headers: {
						Cookie: `${Tokens.ACCESS}=${token};`
					}
				}
			: undefined

		return this.getCurrent(options)
	}
}

export const authService = new AuthService()
