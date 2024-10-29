export function formatPrice(value: number | string): string {
	const parsedValue = typeof value === 'string' ? parseFloat(value) : value

	if (isNaN(parsedValue)) {
		throw new Error(
			'Invalid value provided. Value must be a valid number or numeric string.'
		)
	}

	return `${new Intl.NumberFormat('ru-RU').format(parsedValue)} ₸`
}
