import { Body, Controller, Get, Put, UploadedFiles, UseInterceptors } from '@nestjs/common'
import { FilesInterceptor } from '@nestjs/platform-express'
import { Role, StoreConfig } from '@prisma/client'
import { Roles } from '../auth/roles/roles.decorator'
import { StoreConfigService } from './store-config.service'
import { UpdateStoreConfigDto } from './store-config.types'

@Controller('store-configs')
export class StoreConfigController {
	constructor(private readonly storeConfigService: StoreConfigService) {}

	@Get()
	async getStoreConfig(): Promise<StoreConfig> {
		return this.storeConfigService.getStoreConfig()
	}

	@Put()
	@Roles(Role.ADMIN)
	@UseInterceptors(FilesInterceptor('landingImages[]', 10))
	async updateStoreConfig(
		@Body() dto: UpdateStoreConfigDto,
		@UploadedFiles() landingImages: Express.Multer.File[],
	) {
		return this.storeConfigService.updateStoreConfig(dto, landingImages)
	}
}
