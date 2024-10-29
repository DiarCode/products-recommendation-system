import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { BrandController } from './brand.controller'
import { BrandService } from './brand.service'

@Module({
	controllers: [BrandController],
	providers: [BrandService, PrismaService],
	exports: [BrandService],
})
export class BrandModule {}
