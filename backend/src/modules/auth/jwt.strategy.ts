import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Request } from 'express'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UserService } from '../user/user.service'
import { AuthService } from './auth.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		configService: ConfigService,
		private userService: UserService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					if (req.cookies) {
						return req.cookies[AuthService.ACCESS_TOKEN_NAME]
					}

					return null
				},
			]),
			ignoreExpiration: true,
			secretOrKey: configService.get('JWT_SECRET'),
		})
	}

	async validate(payload: { id: string; role: string }) {
		const user = await this.userService.getUserById(payload.id)

		if (!user || !user.role) {
			throw new UnauthorizedException('User not found or no role assigned')
		}

		return user
	}
}
