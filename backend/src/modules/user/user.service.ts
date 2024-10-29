import {
	BadRequestException,
	ConflictException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'

import { User } from '@prisma/client'
import { hash, verify } from 'argon2'
import { PrismaService } from '../../database/prisma.service'
import { CreateUserDto } from '../auth/auth.dto'
import { UpdateUserDto, UserProfileDTO } from './user.dto'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}

	async getUserById(id: string) {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`)
		}

		return user
	}

	async getUserByPhone(phone: string) {
		const user = await this.prisma.user.findUnique({
			where: { phone },
		})

		return user
	}

	async createUser(dto: CreateUserDto) {
		const existingUser = await this.getUserByPhone(dto.phone)

		if (existingUser) {
			throw new ConflictException('Phone number already exists')
		}

		const createdUser = await this.prisma.user.create({
			data: {
				firstName: dto.firstName,
				lastName: dto.lastName,
				phone: dto.phone,
				password: await hash(dto.password),
			},
		})

		return this.convertToProfileDTO(createdUser)
	}

	async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<UserProfileDTO> {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (!user) {
			throw new NotFoundException(`User with id ${id} not found`)
		}

		if (updateUserDto.password && updateUserDto.oldPassword) {
			const isOldPasswordValid = await verify(user.password, updateUserDto.oldPassword)

			if (!isOldPasswordValid) {
				throw new BadRequestException('Old password is incorrect')
			}

			updateUserDto.password = await hash(updateUserDto.password)
		} else if (updateUserDto.password && !updateUserDto.oldPassword) {
			throw new BadRequestException('Old password is required to update the password')
		}

		const updatedUser = await this.prisma.user.update({
			where: { id },
			data: updateUserDto,
		})

		return this.convertToProfileDTO(updatedUser)
	}

	async getProfile(userId: string): Promise<UserProfileDTO> {
		const user = await this.prisma.user.findUnique({ where: { id: userId } })

		if (!user) {
			throw new NotFoundException('User not found')
		}

		return this.convertToProfileDTO(user)
	}

	convertToProfileDTO(user: User): UserProfileDTO {
		return {
			id: user.id,
			firstName: user.firstName,
			lastName: user.lastName,
			phone: user.phone,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			role: user.role,
		}
	}
}
