import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { BrandCategoryController } from './brand-category.controller'
import { BrandCategoryService } from './brand-category.service'

@Module({
	controllers: [BrandCategoryController],
	providers: [BrandCategoryService, PrismaService],
	exports: [BrandCategoryService],
})
export class BrandCategoryModule {}
