import { Body, Controller, HttpCode, Put } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { UpdateUserDto } from './user.dto'
import { UserService } from './user.service'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@HttpCode(200)
	@Put()
	@Auth()
	async updateUser(@CurrentUser('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.userService.updateUser(id, updateUserDto)
	}
}
