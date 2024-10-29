import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verify } from 'argon2'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { CreateUserDto, LoginDto } from './auth.dto'

@Injectable()
export class AuthService {
	private readonly EXPIRE_DAY_REFRESH_TOKEN_MS = 100 * 24 * 60 * 60 * 1000 // 100 дней в миллисекундах
	private readonly EXPIRE_DAY_ACCESS_TOKEN_MS = 7 * 24 * 60 * 60 * 1000 // 7 дней в миллисекундах
	private readonly EXPIRE_DAY_ACCESS_TOKEN_DAYS = '7d'
	private readonly EXPIRE_DAY_REFRESH_TOKEN_DAYS = '100d'

	static readonly REFRESH_TOKEN_NAME = 'refreshToken'
	static readonly ACCESS_TOKEN_NAME = 'accessToken'

	constructor(
		private jwt: JwtService,
		private userService: UserService,
	) {}

	async login(dto: LoginDto) {
		const user = await this.userService.getUserByPhone(dto.phone)

		if (!user) {
			throw new NotFoundException('User with this phone number does not exists')
		}

		const isValid = await verify(user.password, dto.password)
		if (!isValid) throw new UnauthorizedException('Invalid password')

		const tokens = this.issueTokens(user.id)

		const profile = this.userService.convertToProfileDTO(user)

		return {
			...profile,
			...tokens,
		}
	}

	async register(dto: CreateUserDto) {
		const oldUser = await this.userService.getUserByPhone(dto.phone)

		if (oldUser) {
			throw new BadRequestException('User with this phone number already exists')
		}

		const user = await this.userService.createUser(dto)

		const tokens = this.issueTokens(user.id)

		return {
			...user,
			...tokens,
		}
	}

	private issueTokens(userId: string) {
		const data = { id: userId }

		const accessToken = this.jwt.sign(data, {
			expiresIn: this.EXPIRE_DAY_ACCESS_TOKEN_DAYS,
		})

		const refreshToken = this.jwt.sign(data, {
			expiresIn: this.EXPIRE_DAY_REFRESH_TOKEN_DAYS,
		})

		return { accessToken, refreshToken }
	}

	addTokensToResponse(res: Response, accessToken: string, refreshToken: string) {
		res.cookie(AuthService.ACCESS_TOKEN_NAME, accessToken, {
			httpOnly: true,
			expires: new Date(Date.now() + this.EXPIRE_DAY_ACCESS_TOKEN_MS),
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		})

		res.cookie(AuthService.REFRESH_TOKEN_NAME, refreshToken, {
			httpOnly: true,
			expires: new Date(Date.now() + this.EXPIRE_DAY_REFRESH_TOKEN_MS),
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		})
	}

	removeTokensFromResponse(res: Response) {
		res.cookie(AuthService.ACCESS_TOKEN_NAME, '', {
			httpOnly: true,
			expires: new Date(0),
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		})

		res.cookie(AuthService.REFRESH_TOKEN_NAME, '', {
			httpOnly: true,
			expires: new Date(0),
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'lax',
		})
	}
}
