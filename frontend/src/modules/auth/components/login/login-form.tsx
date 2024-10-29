'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { CURRENT_USER_QUERY_KEY } from '../../hooks/user-current-user.hook'
import { LoginDTO } from '../../models/auth-dto.types'
import { authService } from '../../services/auth.service'

import { LoginFormData, loginFormSchema } from './login-form-types'
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
import { REDIRECT_TO_PARAM_NAME } from '@/core/constants/routes.constant'

export function LoginForm() {
	const searchParams = useSearchParams()
	const queryClient = useQueryClient()
	const router = useRouter()
	const redirectTo = searchParams.get(REDIRECT_TO_PARAM_NAME) || '/'
	const [showPassword, setShowPassword] = useState(false)

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword)
	}

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginFormSchema)
	})

	const { mutate, isPending } = useMutation({
		mutationFn: (dto: LoginDTO) => authService.login(dto),
		onSuccess: () => {
			toast.success('Успешно вошли в аккаунт')
			queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] })
			router.push(redirectTo)
		},
		onError: error => {
			toast.error('Ошибка при входе в аккаунт')
		}
	})

	function onSubmit(values: LoginFormData) {
		const dto: LoginDTO = {
			phone: values.phone,
			password: values.password
		}

		mutate(dto)
	}

	return (
		<Card className='w-full max-w-md'>
			<CardHeader>
				<CardTitle className='text-2xl'>Войти</CardTitle>
				<CardDescription>
					Введите свой телефон, чтобы войти в свой аккаунт
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className='space-y-5'
					>
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
							{isPending ? 'Загрузка...' : 'Войти'}
						</Button>
					</form>
				</Form>

				<div className='mt-5 text-center text-sm'>
					У вас нет аккаунта?{' '}
					<Link
						href='/signup'
						className='underline'
					>
						Зарегистрируйтесь
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
