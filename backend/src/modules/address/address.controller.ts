import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common'

import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'
import { CreateAddressDto, UpdateAddressDto } from './address.dto'
import { AddressService } from './address.service'

@Controller('addresses')
export class AddressController {
	constructor(private addressService: AddressService) {}

	@Get()
	@Auth()
	async getAddresses(@CurrentUser('id') userId: string) {
		return this.addressService.getAddressesByUser(userId)
	}

	@Post()
	@Auth()
	async createAddress(
		@CurrentUser('id') userId: string,
		@Body() createAddressDto: CreateAddressDto,
	) {
		return this.addressService.createAddress(userId, createAddressDto)
	}

	@Get(':addressId')
	@Auth()
	async getAddressById(@CurrentUser('id') userId: string, @Param('addressId') addressId: string) {
		return this.addressService.getAddressByIdAndUser(userId, addressId)
	}

	@Put(':id')
	@Auth()
	async updateAddress(
		@Param('id') id: string,
		@CurrentUser('id') userId: string,
		@Body() updateAddressDto: UpdateAddressDto,
	) {
		return this.addressService.updateAddress(id, userId, updateAddressDto)
	}

	@Delete(':id')
	@Auth()
	async deleteAddress(@Param('id') id: string, @CurrentUser('id') userId: string) {
		return this.addressService.deleteAddress(id, userId)
	}
}
