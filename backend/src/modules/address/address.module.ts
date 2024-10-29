import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { AddressController } from './address.controller'
import { AddressService } from './address.service'

@Module({
	controllers: [AddressController],
	providers: [AddressService, PrismaService],
	exports: [AddressService],
})
export class AddressModule {}
