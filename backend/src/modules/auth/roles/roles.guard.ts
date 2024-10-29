import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { UserService } from '../../user/user.service'
import { ROLES_KEY } from './roles.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private jwtService: JwtService,
		private usersService: UserService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler())
		if (!requiredRoles) {
			return true
		}

		const request = context.switchToHttp().getRequest()

		const token = this.extractTokenFromCookie(request)

		if (!token) {
			throw new UnauthorizedException('No token provided')
		}

		try {
			const payload = this.jwtService.verify(token, {
				secret: process.env.JWT_SECRET,
			})
			request.user = payload

			const user = await this.usersService.getUserById(payload.id)

			if (!user) {
				throw new UnauthorizedException('User not found')
			}

			if (!requiredRoles.includes(user.role)) {
				// Если пользователь не администратор
				throw new UnauthorizedException('Only administrators are allowed to access this resource')
			}

			request.user = user

			return true
		} catch (error) {
			throw new UnauthorizedException(error.message || 'Invalid token or user not authorized')
		}
	}

	private extractTokenFromCookie(request: any): string | null {
		if (request.cookies && request.cookies['accessToken']) {
			return request.cookies['accessToken']
		}
		return null
	}
}
