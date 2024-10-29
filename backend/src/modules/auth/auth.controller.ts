import {
	Body,
	Controller,
	Get,
	HttpCode,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'
import { Response } from 'express'
import { UserService } from '../user/user.service'
import { CreateUserDto, LoginDto } from './auth.dto'
import { AuthService } from './auth.service'
import { Auth } from './decorators/auth.decorator'
import { CurrentUser } from './decorators/user.decorator'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly userService: UserService,
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken, ...response } = await this.authService.login(dto)
		this.authService.addTokensToResponse(res, accessToken, refreshToken)

		return {
			...response,
			accessToken,
		}
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
		const { accessToken, refreshToken, ...response } = await this.authService.register(dto)
		this.authService.addTokensToResponse(res, accessToken, refreshToken)

		return {
			...response,
			accessToken,
		}
	}

	@HttpCode(200)
	@Get('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.authService.removeTokensFromResponse(res)
	}

	@Get('current')
	@Auth()
	async getCurrentUser(@CurrentUser('id') id: string) {
		return this.userService.getProfile(id)
	}
}
