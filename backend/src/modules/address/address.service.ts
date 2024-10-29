import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CreateAddressDto, UpdateAddressDto } from './address.dto'

@Injectable()
export class AddressService {
	constructor(private prisma: PrismaService) {}

	async createAddress(userId: string, createAddressDto: CreateAddressDto) {
		return this.prisma.address.create({
			data: {
				...createAddressDto,
				userId,
			},
		})
	}

	async updateAddress(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
		const address = await this.prisma.address.findUnique({
			where: { id },
		})

		if (!address || address.userId !== userId) {
			throw new NotFoundException('Address not found or you do not have access to it')
		}

		return this.prisma.address.update({
			where: { id },
			data: updateAddressDto,
		})
	}

	async deleteAddress(id: string, userId: string) {
		const address = await this.prisma.address.findUnique({
			where: { id },
		})

		if (!address || address.userId !== userId) {
			throw new NotFoundException('Address not found or you do not have access to it')
		}

		return this.prisma.address.delete({
			where: { id },
		})
	}

	async getAddressesByUser(userId: string) {
		return this.prisma.address.findMany({
			where: { userId },
		})
	}

	async getAddressByIdAndUser(userId: string, addressId: string) {
		const address = await this.prisma.address.findUnique({
			where: { id: addressId, userId: userId },
		})

		if (!address) {
			throw new NotFoundException('Address not found')
		}

		return address
	}
}
