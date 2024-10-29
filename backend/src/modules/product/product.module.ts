import { Module } from '@nestjs/common'
import { PrismaService } from '../../database/prisma.service'
import { BrandCategoryModule } from '../brand-category/brand-category.module'
import { BrandModule } from '../brand/brand.module'
import { SubCategoryModule } from '../sub-category/sub-category.module'
import { ImagesModule } from './../images/images.module'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'

@Module({
	controllers: [ProductController],
	providers: [ProductService, PrismaService],
	exports: [ProductService],
	imports: [ImagesModule, BrandModule, BrandCategoryModule, SubCategoryModule],
})
export class ProductModule {}
