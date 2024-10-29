'use client'

import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { ADMIN_ORDERS_QUERY_KEY } from '../hooks/use-admin-orders.hook'
import { CreateAdminOrderDto } from '../models/admin-order.types'
import { adminOrdersService } from '../services/admin-order.service'

import { AdminCreateOrderAddressForm } from './create/admin-create-order-address'
import { AdminCreateOrderItems } from './create/admin-create-order-items'
import { AdminCreateOrderNotesForm } from './create/admin-create-order-notes'
import {
	AdminCreateOrderFormData,
	adminCreateOrderSchema
} from './create/admin-create-order-schema'
import { Button } from '@/core/components/ui/button'
import { Form } from '@/core/components/ui/form'

export const CreateAdminOrders = () => {
	const form = useForm<AdminCreateOrderFormData>({
		resolver: zodResolver(adminCreateOrderSchema),
		defaultValues: { address: { country: 'Казахстан' } }
	})

	const router = useRouter()
	const queryClient = useQueryClient()

	const { mutate: createOrderMutate, isPending: isCreateOrderPending } =
		useMutation({
			mutationFn: (dto: CreateAdminOrderDto) =>
				adminOrdersService.createOrder(dto),
			onSuccess: () => {
				toast.success('Заказ успешно создан')
				queryClient.invalidateQueries({ queryKey: [ADMIN_ORDERS_QUERY_KEY] })
				router.push('/admin/orders')
			},
			onError: () => {
				toast.error('Ошибка при создании заказа')
			}
		})

	const onBackClick = () => {
		const confirmed = window.confirm(
			'У вас есть несохраненные изменения. Вы действительно хотите уйти?'
		)
		if (!confirmed) return

		router.back()
	}

	const onSubmit = (values: AdminCreateOrderFormData) => {
		const dto: CreateAdminOrderDto = {
			address: values.address,
			orderItems: values.orderItems.map(({ product, quantity }) => ({
				productId: product.id,
				quantity: quantity
			})),
			notes: values.notes
		}

		createOrderMutate(dto)
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className='mx-auto grid flex-1 auto-rows-max gap-4'
			>
				<div className='flex items-center gap-4'>
					<Button
						variant='outline'
						size='icon'
						className='h-7 w-7'
						onClick={onBackClick}
						type='button'
					>
						<ChevronLeft className='h-4 w-4' />
						<span className='sr-only'>Назад</span>
					</Button>
					<h1 className='flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight'>
						Создать заказ
					</h1>

					<div className='flex items-center gap-2 md:ml-auto'>
						<Button
							disabled={isCreateOrderPending}
							size='sm'
							type='submit'
						>
							Сохранить
						</Button>
					</div>
				</div>

				<div className='grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3'>
					<div className='grid auto-rows-max items-start gap-4 lg:col-span-2'>
						<AdminCreateOrderItems form={form} />
					</div>

					<div className='grid auto-rows-max items-start gap-4'>
						<AdminCreateOrderAddressForm form={form} />

						<AdminCreateOrderNotesForm form={form} />
					</div>
				</div>
			</form>
		</Form>
	)
}
