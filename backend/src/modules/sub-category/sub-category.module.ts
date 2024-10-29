import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { CategoryModule } from '../category/category.module'
import { SubCategoryController } from './sub-category.controller'
import { SubCategoryService } from './sub-category.service'

@Module({
	imports: [CategoryModule],
	controllers: [SubCategoryController],
	providers: [SubCategoryService, PrismaService],
	exports: [SubCategoryService],
})
export class SubCategoryModule {}
