import Image from 'next/image'

import { Package } from 'lucide-react'

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow
} from '@/core/components/ui/table'
import { getProductImageUrl } from '@/core/lib/images.utils'
import { formatPrice } from '@/core/lib/price.utils'
import { Orders } from '@/modules/orders/models/orders.types'

interface AdminOrderDetailsProductsProps {
	order: Orders
}

export const AdminOrderDetailsProducts = ({
	order
}: AdminOrderDetailsProductsProps) => {
	return (
		<Card className='shadow-none'>
			<CardHeader>
				<CardTitle className='flex items-center gap-3 text-lg font-bold'>
					<Package className='h-5 w-5' />
					Товары
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow className='border-none'>
							<TableHead className='hidden w-[100px] sm:table-cell'>
								<span className='sr-only'>Картинка</span>
							</TableHead>
							<TableHead className='font-bold'>Название</TableHead>
							<TableHead className='hidden font-bold md:table-cell'>
								Цена
							</TableHead>
							<TableHead className='hidden font-bold md:table-cell'>
								Кол-во
							</TableHead>
							<TableHead className='hidden font-bold md:table-cell'>
								Итого
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{order.orderItems.map(orderItem => (
							<TableRow key={order.id}>
								<TableCell className='hidden sm:table-cell'>
									<div className='relative h-16 w-16 overflow-clip rounded-md bg-muted/50'>
										<Image
											alt={orderItem.product.name}
											className='object-contain'
											src={getProductImageUrl(orderItem.product.images[0])}
											fill
										/>
									</div>
								</TableCell>

								<TableCell className='font-medium'>
									{orderItem.product.name}
								</TableCell>

								<TableCell className='hidden md:table-cell'>
									{formatPrice(orderItem.product.price)}
								</TableCell>

								<TableCell className='hidden md:table-cell'>
									{formatPrice(orderItem.quantity)}
								</TableCell>

								<TableCell className='hidden font-bold md:table-cell'>
									{formatPrice(orderItem.quantity * orderItem.price)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	)
}
