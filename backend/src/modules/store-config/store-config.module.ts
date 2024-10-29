import { Module } from '@nestjs/common'
import { PrismaService } from 'src/database/prisma.service'
import { ImagesModule } from '../images/images.module'
import { StoreConfigController } from './store-config.controller'
import { StoreConfigService } from './store-config.service'

@Module({
	providers: [StoreConfigService, PrismaService],
	controllers: [StoreConfigController],
	imports: [ImagesModule],
})
export class StoreConfigModule {}
