import { Metadata } from 'next'

import { SignupForm } from '@/modules/auth/components/signup/signup-form'

export const metadata: Metadata = {
	title: 'Регистрация'
}

export default async function SignupPage() {
	return (
		<div className='flex h-[calc(100vh-200px)] items-center justify-center'>
			<SignupForm />
		</div>
	)
}
