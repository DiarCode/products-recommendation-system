import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { StoreConfig } from '@prisma/client'
import { PrismaService } from 'src/database/prisma.service'
import { ImagesService, LANDING_IMAGES_DIR } from '../images/images.service'
import { LoggerService } from '../logger/logger.service'
import { UpdateStoreConfigDto } from './store-config.types'

@Injectable()
export class StoreConfigService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly logger: LoggerService,
		private readonly imagesService: ImagesService,
	) {}

	async getStoreConfig(): Promise<StoreConfig> {
		let config = await this.prisma.storeConfig.findFirst()

		if (!config) {
			config = await this.createStoreConfig({
				storeName: 'Tekno',
				storeDescription: 'Tekno — ваш надёжный поставщик технического оборудования',
				storeKeywords: 'техническое оборудование, роутеры, модемы, сети, интернет-устройства',
				landingImages: [],
			})
		}

		return config
	}

	async createStoreConfig(data: Partial<StoreConfig>): Promise<StoreConfig> {
		return this.prisma.storeConfig.create({ data })
	}

	async updateStoreConfig(dto: UpdateStoreConfigDto, files?: Express.Multer.File[]) {
		const { landingImagesToDelete } = dto

		console.log(landingImagesToDelete)

		const storeConfig = await this.getStoreConfig()

		try {
			return await this.prisma.$transaction(async tx => {
				if (landingImagesToDelete && landingImagesToDelete.length > 0) {
					await Promise.all(
						landingImagesToDelete.map(async imagePath => {
							await this.imagesService.deleteImage(imagePath, LANDING_IMAGES_DIR)
							storeConfig.landingImages = storeConfig.landingImages.filter(
								image => image !== imagePath,
							)
						}),
					)
				}

				if (files && files.length > 0) {
					const newImagePaths = await Promise.all(
						files.map(file => this.imagesService.saveImage(file, LANDING_IMAGES_DIR)),
					)
					storeConfig.landingImages = [...storeConfig.landingImages, ...newImagePaths]
				}

				const updatedStoreConfig = await tx.storeConfig.update({
					where: { id: storeConfig.id },
					data: {
						storeName: dto.storeName || storeConfig.storeName,
						storeDescription: dto.storeDescription || storeConfig.storeDescription,
						storeKeywords: dto.storeKeywords || storeConfig.storeKeywords,
						landingImages: storeConfig.landingImages,
					},
				})

				return updatedStoreConfig
			})
		} catch (err) {
			this.logger.error(`Failed to update store configuration: ${err.message}`, err.stack)
			throw new InternalServerErrorException(`Failed to update store configuration: ${err.message}`)
		}
	}
}
