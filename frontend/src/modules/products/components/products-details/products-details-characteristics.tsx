import { Separator } from '@/core/components/ui/separator'
import { cn } from '@/core/lib/tailwind.utils'

export interface ProductsCharacteristicsListItem {
	label: string
	value: string
}

interface ProductsDetailsCharacteristicsProps {
	items: ProductsCharacteristicsListItem[]
	className?: string
}

export const ProductsDetailsCharacteristics = ({
	items,
	className
}: ProductsDetailsCharacteristicsProps) => {
	return (
		<div className={cn('flex flex-col gap-3', className)}>
			{items.map((item, index) => (
				<div
					key={index}
					className='flex flex-col gap-3'
				>
					<ProductsDetailsCharacteristicsItem
						label={item.label}
						value={item.value}
					/>
					{index < items.length - 1 && <Separator />}
				</div>
			))}
		</div>
	)
}

interface ProductsDetailsCharacteristicsItemProps {
	label: string
	value: string
	className?: string
}

const ProductsDetailsCharacteristicsItem = ({
	label,
	value,
	className
}: ProductsDetailsCharacteristicsItemProps) => {
	return (
		<div className={cn('grid grid-cols-2 gap-4', className)}>
			<p>{label}</p>
			<p className='font-medium'>{value}</p>
		</div>
	)
}
