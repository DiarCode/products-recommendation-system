import { Controller, Get, Param, Res } from '@nestjs/common'
import { Response } from 'express'
import { ImagesService, LANDING_IMAGES_DIR, PRODUCT_IMAGES_DIR } from './images.service'

@Controller('images')
export class ImagesController {
	constructor(private imagesService: ImagesService) {}

	@Get('/products/:image')
	getProductImage(@Param('image') image: string, @Res({ passthrough: true }) res: Response) {
		return this.imagesService.getImageByFilename(image, PRODUCT_IMAGES_DIR, res)
	}

	@Get('/landing/:image')
	getLandingImage(@Param('image') image: string, @Res({ passthrough: true }) res: Response) {
		return this.imagesService.getImageByFilename(image, LANDING_IMAGES_DIR, res)
	}
}
