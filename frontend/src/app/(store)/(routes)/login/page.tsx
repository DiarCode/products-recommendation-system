import { Metadata } from 'next'

import { LoginForm } from '@/modules/auth/components/login/login-form'

export const metadata: Metadata = {
	title: 'Войти'
}

export default async function LoginPage() {
	return (
		<div className='flex h-[calc(100vh-200px)] items-center justify-center'>
			<LoginForm />
		</div>
	)
}
