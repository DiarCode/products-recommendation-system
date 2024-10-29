import { brandService } from '@/modules/brands/services/brands.service'
import { subCategoriesService } from '@/modules/categories/services/sub-category.service'
import { productsService } from '@/modules/products/services/products.service'

const URL = process.env.NEXT_PUBLIC_URL

export default async function sitemap() {
	const products = (await productsService.getAllProducts()).map(
		({ id, createdAt }) => ({
			url: `${URL}/products/${id}`,
			lastModified: createdAt
		})
	)

	const subCategories = (await subCategoriesService.getSubCategories()).map(
		({ id }) => ({
			url: `${URL}/products?subCategoryId=${id}`,
			lastModified: new Date().toISOString()
		})
	)

	const brands = (await brandService.getAll()).map(({ id, createdAt }) => ({
		url: `${URL}/brands/${id}`,
		lastModified: createdAt
	}))

	const routes = ['', '/products', '/brands', '/categories'].map(route => ({
		url: `${URL}${route}`,
		lastModified: new Date().toISOString()
	}))

	return [...routes, ...products, ...brands, ...subCategories]
}
