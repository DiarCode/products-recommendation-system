import { format, isThisYear } from 'date-fns'
import { ru } from 'date-fns/locale'

export const formatOrderDate = (dateString: string | Date): string => {
	const date = new Date(dateString)

	const formattedDate = format(date, 'd MMMM', { locale: ru })

	if (!isThisYear(date)) {
		const year = format(date, 'yyyy')
		return `${formattedDate} ${year}`
	}

	return formattedDate
}
