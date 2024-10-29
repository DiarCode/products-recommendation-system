'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	StoreConfig,
	UpdateStoreConfigDto
} from '../../models/store-config.types'
import { adminStoreConfigsService } from '../../services/store-config.service'

import {
	StoreConfigFormData,
	storeConfigSchema
} from './store-config-form-schema'
import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { cn } from '@/core/lib/tailwind.utils'

interface StoreConfigFormProps {
	storeConfig: StoreConfig
}

export function StoreConfigForm({ storeConfig }: StoreConfigFormProps) {
	const form = useForm<StoreConfigFormData>({
		resolver: zodResolver(storeConfigSchema),
		defaultValues: {
			storeName: storeConfig?.storeName,
			storeDescription: storeConfig?.storeDescription,
			storeKeywords: storeConfig?.storeKeywords
		}
	})

	const { mutate: updateStoreConfig, isPending: isUpdatePending } = useMutation(
		{
			mutationFn: (dto: UpdateStoreConfigDto) =>
				adminStoreConfigsService.updateStoreConfig(dto),
			onSuccess: () => {
				toast.success('Конфигурация магазина обновлена')
			},
			onError: () => {
				toast.error('Ошибка при обновлении конфигурации магазина')
			}
		}
	)

	const onSubmit = (data: StoreConfigFormData) => {
		const dto: UpdateStoreConfigDto = {
			storeName: data.storeName,
			storeDescription: data.storeDescription,
			storeKeywords: data.storeKeywords
		}

		updateStoreConfig(dto)
	}

	return (
		<Card className='shadow-none'>
			<CardHeader>
				<div className='flex items-start justify-between gap-4'>
					<div className='space-y-1'>
						<CardTitle className='text-base font-bold'>
							Настройки магазина
						</CardTitle>
						<CardDescription>
							Измените данные вашего магазина здесь
						</CardDescription>
					</div>

					<Button
						type='submit'
						form='store-config-form'
						size='sm'
						disabled={isUpdatePending}
					>
						Сохранить
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						id='store-config-form'
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex w-full flex-col gap-4'
					>
						<SettingsModifySections
							title='Название магазина'
							className='mt-7 border-b border-gray-100 pb-7'
						>
							<FormField
								control={form.control}
								name='storeName'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='text'
												placeholder='Введите название вашего магазина'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</SettingsModifySections>

						<SettingsModifySections
							title='Описание магазина'
							className='mt-7 border-b border-gray-100 pb-7'
						>
							<FormField
								control={form.control}
								name='storeDescription'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='text'
												placeholder='Введите описание вашего магазина'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</SettingsModifySections>

						<SettingsModifySections
							title='Ключевые слова'
							className='mt-7 border-b border-gray-100 pb-7'
						>
							<FormField
								control={form.control}
								name='storeKeywords'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='text'
												placeholder='Введите ключевые слова вашего магазина'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</SettingsModifySections>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}

interface SettingsModifySectionsProps extends PropsWithChildren {
	title: string
	description?: string
	className?: string
}

export const SettingsModifySections = ({
	children,
	className,
	title,
	description
}: SettingsModifySectionsProps) => {
	return (
		<div className={cn('grid grid-cols-5 gap-4', className)}>
			<div className='col-span-1'>
				<p className='text-sm font-medium'>{title}</p>
				{description && (
					<p className='text-sm text-muted-foreground'>{description}</p>
				)}
			</div>
			<div className='col-span-4 w-full'>{children}</div>
		</div>
	)
}
