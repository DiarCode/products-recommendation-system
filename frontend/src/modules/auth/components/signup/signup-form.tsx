'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CURRENT_USER_QUERY_KEY } from '../../hooks/user-current-user.hook'
import { SignupDTO } from '../../models/auth-dto.types'
import { authService } from '../../services/auth.service'

import { SignupFormData, signupFormSchema } from './signup-form-types'
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
	FormLabel,
	FormMessage
} from '@/core/components/ui/form'
import { Input } from '@/core/components/ui/input'
import { UserTypesEnum } from '@/modules/users/models/users.types'

export function SignupForm() {
	const queryClient = useQueryClient()
	const router = useRouter()

	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupFormSchema),
		mode: 'onSubmit'
	})

	const { mutate, isPending } = useMutation({
		mutationFn: (dto: SignupDTO) => authService.signup(dto),
		onSuccess: () => {
			toast.success('Успешно прошли регистрацию аккаунта')
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			router.push('/')
		},
		onError: error => {
			toast.error('Ошибка при регистрации')
		}
	})

	function onSubmit(values: SignupFormData) {
		const dto: SignupDTO = {
			phone: values.phone,
			password: values.password,
			firstName: values.firstName,
			lastName: values.lastName,
			userType: UserTypesEnum.INDIVIDUAL
		}
		mutate(dto)
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle className='text-lg'>Регистрация</CardTitle>
				<CardDescription>
					Введите свои данные для создания учетной записи
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
					>
						<div className='grid grid-cols-2 gap-4'>
							<FormField
								control={form.control}
								name='firstName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Имя</FormLabel>
										<FormControl>
											<Input
												placeholder='Введите ваше имя'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name='lastName'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Фамилия</FormLabel>
										<FormControl>
											<Input
												placeholder='Введите вашу фамилию'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name='phone'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Номер телефона</FormLabel>
									<FormControl>
										<Input
											placeholder='+7 000 000-00-00'
											type='tel'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Пароль</FormLabel>
									<FormControl>
										<div className='relative'>
											<Input
												placeholder='Введите пароль'
												type={showPassword ? 'text' : 'password'}
												{...field}
											/>

											<button
												type='button'
												className='absolute inset-y-0 right-0 flex items-center px-4'
												onClick={togglePasswordVisibility}
											>
												{showPassword ? (
													<EyeOff className='h-5 w-5 text-muted-foreground' />
												) : (
													<Eye className='h-5 w-5 text-muted-foreground' />
												)}
											</button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type='submit'
							className='w-full'
							disabled={isPending}
						>
							{isPending ? 'Создание аккаунта...' : 'Создать аккаунт'}
						</Button>
					</form>
				</Form>

				<div className='mt-5 text-center text-sm'>
					У вас уже есть аккаунт?{' '}
					<Link
						href='/login'
						className='underline'
					>
						Войдите
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
