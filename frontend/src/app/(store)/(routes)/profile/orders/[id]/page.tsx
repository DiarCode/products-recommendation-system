import { cookies } from 'next/headers'
import Image from 'next/image'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { CreditCard, MapPin, Package, User } from 'lucide-react'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { Button } from '@/core/components/ui/button'
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
import { Tokens } from '@/modules/auth/models/auth-dto.types'
import { MY_ORDER_DETAILS_QUERY_KEY } from '@/modules/orders/hooks/use-my-order.hook'
import { ORDER_STATUS_FORMATTED } from '@/modules/orders/models/orders.types'
import { ordersService } from '@/modules/orders/services/orders.service'
import { formatOrderDate } from '@/modules/orders/utils/format-date.util'
import { getUserFullName } from '@/modules/users/utils/users-format.utils'

type Props = {
	params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const token = cookies().get(Tokens.ACCESS)?.value
	const order = await ordersService.getMyOrderById(params.id, token)

	return {
		title: order
			? `Заказ от ${formatOrderDate(order?.createdAt)}`
			: 'Неизвестный заказ'
	}
}

export default async function OrderDetailsPage({ params }: Props) {
	const queryClient = getQueryClient()
	const token = cookies().get(Tokens.ACCESS)?.value

	const order = await ordersService.getMyOrderById(params.id, token)

	await queryClient.prefetchQuery({
		queryKey: [MY_ORDER_DETAILS_QUERY_KEY, params.id],
		queryFn: () => ordersService.getMyOrderById(params.id, token),
		initialData: order
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			{order ? (
				<div>
					<div className='flex items-start justify-between gap-4'>
						<div>
							<div className='flex items-center gap-4'>
								<h1 className='text-3xl font-bold'>
									Заказ от {formatOrderDate(order.createdAt)}
								</h1>

								<div className='w-fit rounded-md bg-primary px-3 py-1 text-primary-foreground'>
									{ORDER_STATUS_FORMATTED[order.status]}
								</div>
							</div>
						</div>

						<div className='flex items-center gap-2'>
							<Button variant='link'>Счет на оплату</Button>
						</div>
					</div>

					<div className='mt-8 grid grid-cols-3 gap-4'>
						<div className='col-span-1 rounded-xl border p-6'>
							<div className='flex items-center gap-3'>
								<MapPin className='h-6 w-6 font-bold' />
								<p className='text-lg font-bold'>Доставка</p>
							</div>

							<div className='mt-6 flex flex-col gap-3'>
								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Страна</p>
									<p className='flex justify-end text-end'>
										{order.address.country}
									</p>
								</div>

								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Город</p>
									<p className='flex justify-end text-end'>
										{order.address.city}
									</p>
								</div>

								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Адрес</p>
									<p className='flex justify-end text-end'>
										{order.address.address}
									</p>
								</div>
							</div>
						</div>

						<div className='col-span-1 rounded-xl border p-6'>
							<div className='flex justify-between'>
								<div className='flex items-center gap-3'>
									<CreditCard className='h-6 w-6 font-bold' />
									<p className='text-base font-bold'>
										{order.isPaid ? 'Оплачено' : 'Ожидает оплаты'}
									</p>
								</div>

								{/* <p className='mt-1 text-muted-foreground'>Картой</p> */}
							</div>

							<div className='mt-6 flex flex-col gap-3'>
								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Товары</p>
									<p className='flex justify-end text-end'>
										{formatPrice(order.totalPrice)}
									</p>
								</div>

								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Доставка</p>
									<p className='flex justify-end text-end'>Бесплатно</p>
								</div>

								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Итого</p>
									<p className='flex justify-end text-end'>
										{formatPrice(order.totalPrice)}
									</p>
								</div>
							</div>
						</div>

						<div className='col-span-1 rounded-xl border p-6'>
							<div className='flex items-center gap-3'>
								<User className='h-6 w-6 font-bold' />
								<p className='text-lg font-bold'>Получатель</p>
							</div>

							<div className='mt-6 flex flex-col gap-3'>
								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Имя</p>
									<p className='flex justify-end text-end'>
										{getUserFullName(order.user)}
									</p>
								</div>

								<div className='grid grid-cols-2 justify-between gap-10'>
									<p className='font-bold'>Телефон</p>
									<p className='flex justify-end text-end'>
										{order.user.phone}
									</p>
								</div>
							</div>
						</div>
					</div>

					<div className='mt-6'>
						<Card className='shadow-none'>
							<CardHeader>
								<CardTitle className='flex items-center gap-3 text-xl font-bold'>
									<Package className='h-6 w-6' />
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
															src={getProductImageUrl(
																orderItem.product.images[0]
															)}
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
					</div>
				</div>
			) : (
				<div className='mt-12 flex justify-center'>
					<div className='max-w-sm'>
						<h1 className='text-center text-2xl font-bold'>Заказ не найден</h1>
						<h2 className='mt-4 text-center'>
							Пожалуйста, проверьте правильность пути или выберите другой заказ
							из списка.
						</h2>
					</div>
				</div>
			)}
		</HydrationBoundary>
	)
}
