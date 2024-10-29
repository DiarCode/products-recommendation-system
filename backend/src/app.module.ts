import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaService } from './database/prisma.service'
import { AddressModule } from './modules/address/address.module'
import { AnalyticsModule } from './modules/analytics/analytics.module'
import { AuthModule } from './modules/auth/auth.module'
import { LoggerModule } from './modules/logger/logger.module'

import { CacheModule } from '@nestjs/cache-manager'
import { BrandModule } from './modules/brand/brand.module'
import { CategoryModule } from './modules/category/category.module'
import { ImagesModule } from './modules/images/images.module'
import { OrderModule } from './modules/order/order.module'
import { ProductRatingsModule } from './modules/product-ratings/product-ratings.module'
import { ProductModule } from './modules/product/product.module'
import { StoreConfigModule } from './modules/store-config/store-config.module'
import { SubCategoryModule } from './modules/sub-category/sub-category.module'
import { UserModule } from './modules/user/user.module'
import { SharedModule } from './shared/shared.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			envFilePath: '.env',
		}),
		CacheModule.register({ isGlobal: true }),
		LoggerModule,
		SharedModule,
		AuthModule,
		UserModule,
		CategoryModule,
		SubCategoryModule,
		ProductModule,
		AddressModule,
		OrderModule,
		AnalyticsModule,
		BrandModule,
		BrandModule,
		ImagesModule,
		ProductRatingsModule,
		StoreConfigModule,
	],
	controllers: [],
	providers: [PrismaService],
})
export class AppModule {}
