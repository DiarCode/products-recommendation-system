import { BadRequestException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common'
import * as crypto from 'crypto'
import { Response } from 'express'
import { createReadStream, existsSync, promises as fs } from 'fs'
import * as path from 'path'
import * as sharp from 'sharp'
import { LoggerService } from '../logger/logger.service'

export const PRODUCT_IMAGES_DIR = path.resolve(process.cwd(), 'public/images/products')
export const LANDING_IMAGES_DIR = path.resolve(process.cwd(), 'public/images/landing')
export const IMAGES_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.svg']

@Injectable()
export class ImagesService {
	constructor(private readonly logger: LoggerService) {
		fs.mkdir(PRODUCT_IMAGES_DIR, { recursive: true }).catch(err => {
			this.logger.error(`Failed to create product images directory: ${err.message}`, err.stack)
		})

		fs.mkdir(LANDING_IMAGES_DIR, { recursive: true }).catch(err => {
			this.logger.error(`Failed to create landing images directory: ${err.message}`, err.stack)
		})
	}

	async saveImage(file: Express.Multer.File, basePath: string): Promise<string> {
		try {
			const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '')
	
			const hash = crypto
				.createHash('sha256') // Secure hashing
				.update(sanitizedFilename + Date.now().toString())
				.digest('hex')
			const extension = path.extname(sanitizedFilename).toLowerCase()
	
			if (!IMAGES_EXTENSIONS.includes(extension)) {
				throw new BadRequestException('Unsupported file type.')
			}
	
			const filename = `${hash}${extension}`
			await fs.mkdir(basePath, { recursive: true })
	
			// Ensure final path is within basePath
			const filePath = path.join(basePath, filename)
			const normalizedFilePath = path.normalize(filePath)
			if (!normalizedFilePath.startsWith(basePath)) {
				throw new BadRequestException('Invalid file path.')
			}
	
			await sharp(file.buffer).webp({ quality: 100 }).toFile(normalizedFilePath)
	
			return filename
		} catch (err) {
			this.logger.error(`Error saving image: ${err.message}`, err.stack)
			throw new Error(`Error saving image: ${err.message}`)
		}
	}
	
	async deleteImage(imageFilename: string, basePath: string): Promise<void> {
		try {
			const sanitizedFilename = imageFilename.replace(/[^a-zA-Z0-9.\-_]/g, '')
	
			const absoluteImagePath = path.resolve(basePath, sanitizedFilename)
			const normalizedPath = path.normalize(absoluteImagePath)
	
			if (!normalizedPath.startsWith(basePath)) {
				throw new BadRequestException('Invalid file path.')
			}
	
			await fs.stat(normalizedPath)
			await fs.unlink(normalizedPath)
		} catch (err) {
			if (err.code === 'ENOENT') {
				this.logger.warn(`Image not found: ${imageFilename}`)
			} else {
				this.logger.error(`Error deleting image: ${err.message}`, err.stack)
				throw new Error(`Error deleting image: ${err.message}`)
			}
		}
	}	

	getImageByFilename(filename: string, basePath: string, res: Response): StreamableFile {
		const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.\-_]/g, '')
	
		const imagePath = path.join(basePath, sanitizedFilename)
		const normalizedPath = path.normalize(imagePath)
	
		if (!normalizedPath.startsWith(basePath)) {
			this.logger.warn(`Invalid file path: ${filename}`)
			throw new NotFoundException('Invalid file path')
		}
	
		if (!existsSync(normalizedPath)) {
			this.logger.warn(`Image not found: ${normalizedPath}`)
			throw new NotFoundException('Image not found')
		}
	
		const extension = path.extname(sanitizedFilename).toLowerCase()
		switch (extension) {
			case '.jpg':
			case '.jpeg':
				res.set({ 'Content-Type': 'image/jpeg' })
				break
			case '.png':
				res.set({ 'Content-Type': 'image/png' })
				break
			case '.webp':
				res.set({ 'Content-Type': 'image/webp' })
				break
			case '.svg':
				res.set({ 'Content-Type': 'image/svg+xml' })
				break
			default:
				this.logger.warn(`Unsupported image type: ${filename}`)
				throw new NotFoundException('Unsupported image type')
		}
	
		const fileStream = createReadStream(normalizedPath)
		this.logger.log(`Serving image: ${normalizedPath}`)
		return new StreamableFile(fileStream)
	}
	
}
