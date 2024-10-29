'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { PropsWithChildren } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
	ProfileSettingsFormData,
	profileSettingsSchema
} from './profile-settings-form-schema'
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
import {
	CURRENT_USER_QUERY_KEY,
	useCurrentUser
} from '@/modules/auth/hooks/user-current-user.hook'
import { UpdateUserDto } from '@/modules/auth/models/users-dto.types'
import { usersService } from '@/modules/auth/services/user.service'

export function ProfileSettingsForm() {
	const queryClient = useQueryClient()
	const { data: user } = useCurrentUser()

	const form = useForm<ProfileSettingsFormData>({
		resolver: zodResolver(profileSettingsSchema),
		defaultValues: {
			firstName: user?.firstName,
			lastName: user?.lastName,
			phone: user?.phone
		}
	})

	const { mutate: updateUser, isPending: isUpdatePending } = useMutation({
		mutationFn: (dto: UpdateUserDto) => usersService.updateUser(dto),
		onSuccess: () => {
			toast.success('Ваша учетная запись обновлена')
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
		},
		onError: () => {
			toast.error('Ошибка при обновлении учетной записи')
		}
	})

	const onSubmit = (data: ProfileSettingsFormData) => {
		const dto: UpdateUserDto = {
			phone: data.phone,
			firstName: data.firstName,
			lastName: data.lastName
		}

		updateUser(dto)
	}

	return (
		<Card className='shadow-none'>
			<CardHeader>
				<div className='flex items-start justify-between gap-4'>
					<div className='space-y-1'>
						<CardTitle className='text-base font-bold'>
							Настройки профиля
						</CardTitle>
						<CardDescription>
							Измените ваши персональные данные здесь
						</CardDescription>
					</div>

					<Button
						type='submit'
						form='profile-settings-form'
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
						id='profile-settings-form'
						onSubmit={form.handleSubmit(onSubmit)}
						className='flex w-full flex-col gap-4'
					>
						<SettingsModifySections
							title='Имя'
							className='mt-7 border-b border-gray-100 pb-7'
						>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='text'
												placeholder='Введите ваше имя'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</SettingsModifySections>

						<SettingsModifySections
							title='Фамилия'
							className='mt-7 border-b border-gray-100 pb-7'
						>
							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='text'
												placeholder='Введите вашу фамилию'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</SettingsModifySections>

						<SettingsModifySections
							title='Номер телефона'
							className='mt-7 border-b border-gray-100 pb-7'
						>
							<FormField
								control={form.control}
								name='phone'
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Input
												type='tel'
												placeholder='Введите ваш номер телефона'
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
