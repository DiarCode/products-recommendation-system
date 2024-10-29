import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { AddressModule } from '../address/address.module'
import { ProductModule } from '../product/product.module'
import { UserModule } from '../user/user.module'
import { OrderController } from './order.controller'
import { OrderService } from './order.service'

@Module({
	controllers: [OrderController],
	providers: [OrderService, PrismaService],
	exports: [OrderService],
	imports: [UserModule, ProductModule, AddressModule],
})
export class OrderModule {}
