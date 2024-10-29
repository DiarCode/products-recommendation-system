import { cookies } from 'next/headers'

import { Metadata } from 'next'
import React from 'react'

import { getPage } from '@/core/config/pages.config'
import { NO_INDEX_PAGE } from '@/core/constants/seo.constants'
import { AdminStoreLandingImages } from '@/modules/admin/store-config/components/landing-image-config'
import { StoreConfigForm } from '@/modules/admin/store-config/components/store-form/store-config-form'
import { adminStoreConfigsService } from '@/modules/admin/store-config/services/store-config.service'

export const metadata: Metadata = {
	title: getPage('ADMIN_STORE_CONFIG').label,
	...NO_INDEX_PAGE
}

export default async function AdminStoreConfigPage() {
	const storeConfig = await adminStoreConfigsService.getStoreConfig({
		headers: { Cookie: cookies().toString() }
	})

	return (
		<>
			{storeConfig ? (
				<div className='relative h-full w-full'>
					<AdminStoreLandingImages initialImages={storeConfig.landingImages} />

					<div className='mt-6'>
						<StoreConfigForm storeConfig={storeConfig} />
					</div>
				</div>
			) : (
				<div>Конфигурация не найден</div>
			)}
		</>
	)
}
