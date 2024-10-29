import { PrismaClient, ProductsStatus } from '@prisma/client'
import * as axios from 'axios'
import * as csv from 'csv-parser'
import * as fs from 'fs'
import { nanoid } from 'nanoid'
import { ImagesService, PRODUCT_IMAGES_DIR } from '../src/modules/images/images.service'
import { LoggerService } from '../src/modules/logger/logger.service'

// Command to run script:
// npx ts-node ./scripts/fill-products.ts

const prisma = new PrismaClient()
const loggerService = new LoggerService()
const imagesService = new ImagesService(loggerService)

interface ProductCSV {
	title: string
	category: string
	subCategory: string
	description: string
	specification?: string
	brand: string
	brandCategory: string
	price: number
	image: string
}

const readCSV = async (filePath: string): Promise<ProductCSV[]> => {
	const results: ProductCSV[] = []

	const stream = fs.createReadStream(filePath).pipe(csv())

	return new Promise((resolve, reject) => {
		stream
			.on('data', data => results.push(data))
			.on('end', () => resolve(results))
			.on('error', reject)
	})
}

const findOrCreateCategoryAndSubCategory = async (
	categoryName: string,
	subCategoryName: string,
) => {
	const category = await prisma.category.upsert({
		where: { name: categoryName.trim() },
		update: {},
		create: { name: categoryName.trim() },
	})

	const subCategory = await prisma.subCategory.upsert({
		where: {
			name_categoryId: {
				name: subCategoryName.trim(),
				categoryId: category.id,
			},
		},
		update: {},
		create: { name: subCategoryName.trim(), categoryId: category.id },
	})

	return subCategory.id
}

const findOrCreateBrand = async (brandName: string, brandCategoryName: string) => {
	const brand = await prisma.brand.upsert({
		where: { name: brandName.trim() },
		update: {},
		create: { name: brandName.trim() },
	})

	const brandCategory = await prisma.brandCategory.upsert({
		where: {
			name_brandId: {
				name: brandCategoryName.trim(),
				brandId: brand.id,
			},
		},
		update: {},
		create: { name: brandCategoryName.trim(), brandId: brand.id },
	})

	return { brandId: brand.id, brandCategoryId: brandCategory.id }
}

const saveImageByUrl = async (url: string): Promise<string | null> => {
	try {
		const response = await axios.default.get(url, {
			responseType: 'arraybuffer',
		})

		const imageBuffer = Buffer.from(response.data)

		const file: Express.Multer.File = {
			originalname: url.split('/').pop() || 'image.png',
			buffer: imageBuffer,
			mimetype: response.headers['content-type'],
		} as Express.Multer.File

		const imageFilename = await imagesService.saveImage(file, PRODUCT_IMAGES_DIR)
		return imageFilename
	} catch (error) {
		loggerService.error(`Failed to save image from URL: ${url}. Error: ${error.message}`)
		return null
	}
}

const getSavedFilenamesByUrls = async (imageUrls: string): Promise<string[]> => {
	const urls = imageUrls.split(';')
	const filenames = await Promise.all(
		urls.map(async url => {
			const trimmedUrl = url.trim()
			if (trimmedUrl) {
				return await saveImageByUrl(trimmedUrl)
			}
			return null
		}),
	)

	return filenames.filter(Boolean) as string[]
}

const parseSpecifications = (specifications: string): Record<string, string> => {
	const characteristics: Record<string, string> = {}
	const entries = specifications.split(';')

	for (const entry of entries) {
		const [key, value] = entry.split(':').map(part => part.trim())
		if (key && value) {
			characteristics[key] = value
		}
	}

	return characteristics
}

const generateSKU = async (): Promise<string> => {
	let sku: string
	do {
		sku = `${nanoid(10).toUpperCase()}`
	} while (await prisma.product.findFirst({ where: { articul: sku } }))

	return sku
}

const generateBarcode = async (): Promise<string> => {
	let barcode: string
	do {
		barcode = nanoid(12)
	} while (await prisma.product.findFirst({ where: { barcode } }))

	return barcode
}

const insertProducts = async (csvFilePath: string) => {
	const csvProducts = await readCSV(csvFilePath)
	const failedProducts: string[] = []
	const batchSize = 100
	const productPromises: Promise<void>[] = []

	for (const csvProduct of csvProducts) {
		const productPromise = (async () => {
			try {
				const subCategoryId = await findOrCreateCategoryAndSubCategory(
					csvProduct.category,
					csvProduct.subCategory,
				)
				const { brandId, brandCategoryId } = await findOrCreateBrand(
					csvProduct.brand,
					csvProduct.subCategory,
				)

				const characteristics: Record<string, string> = csvProduct.specification
					? parseSpecifications(csvProduct.specification)
					: {}
				const articul = await generateSKU()
				const barcode = await generateBarcode()
				const stock = 1000

				const imageFilenames = await getSavedFilenamesByUrls(csvProduct.image)

				await prisma.product.create({
					data: {
						name: csvProduct.title,
						description: csvProduct.description,
						subCategoryId,
						brandId,
						brandCategoryId,
						characteristics,
						images: imageFilenames,
						articul,
						barcode,
						price: parseFloat(csvProduct.price.toString()),
						stock,
						status: ProductsStatus.ACTIVE,
					},
				})
			} catch (error) {
				loggerService.error(`Error inserting product "${csvProduct.title}": ${error.message}`)
				failedProducts.push(csvProduct.title)
			}
		})()

		productPromises.push(productPromise)

		if (productPromises.length >= batchSize) {
			await Promise.all(productPromises)
			productPromises.length = 0
		}
	}

	if (productPromises.length > 0) {
		await Promise.all(productPromises)
	}

	if (failedProducts.length > 0) {
		loggerService.warn(
			`The following products failed to insert (${failedProducts.length}): ${failedProducts.join(', ')}`,
		)
	} else {
		loggerService.log('All products were inserted successfully!')
	}
}

insertProducts('./data/meraki_products_v2.csv')
	.then(() => loggerService.log('Product insertion completed!'))
	.catch(error => loggerService.error('Error during the product insertion process:', error))
	.finally(() => prisma.$disconnect())
