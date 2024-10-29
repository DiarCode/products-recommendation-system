import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'

@Module({
	controllers: [CategoryController],
	providers: [CategoryService, PrismaService],
	exports: [CategoryService],
})
export class CategoryModule {}
