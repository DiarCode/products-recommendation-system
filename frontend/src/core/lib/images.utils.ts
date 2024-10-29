import { environment } from '../config/environment.config'

const placeholderImage = '/images/placeholder.png'

const IMAGE_DOMAINS = {
	PRODUCTS: 'products',
	LANDING: 'landing'
}

interface GetImageUrlByTypeProps {
	href?: string | null
	type: keyof typeof IMAGE_DOMAINS
}

export const getImageUrlByType = ({ href, type }: GetImageUrlByTypeProps) => {
	if (!href) return placeholderImage

	if (href.includes('http')) return href

	const typeValue = IMAGE_DOMAINS[type]
	return `${environment.apiUrl}/api/v1/images/${typeValue}/${href}`
}

export const getProductImageUrl = (href?: string | null) => {
	return getImageUrlByType({ href, type: 'PRODUCTS' })
}

export const getLandingImageUrl = (href?: string | null) => {
	return getImageUrlByType({ href, type: 'LANDING' })
}
