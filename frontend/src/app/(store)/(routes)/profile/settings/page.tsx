import { Metadata } from 'next'
import { Suspense } from 'react'

import { ProfileSettingsForm } from '@/modules/profile/components/profile-settings-form'

export const metadata: Metadata = {
	title: 'Моя учетная запись'
}

export default function SettingsPage() {
	return (
		<Suspense fallback='Загрузка...'>
			<ProfileSettingsForm />
		</Suspense>
	)
}
