import { cookies } from 'next/headers'

import { HydrationBoundary, dehydrate } from '@tanstack/react-query'
import { Metadata } from 'next'

import { getQueryClient } from '@/core/api/query-client'
import { CreateAddressButton } from '@/modules/address/components/create-address/create-address-button'
import { MyAddressesList } from '@/modules/address/components/my-addresses-list'
import { ADDRESSES_QUERY_KEY } from '@/modules/address/hooks/use-adresses.hook'
import { addressService } from '@/modules/address/services/address.service'

export const metadata: Metadata = {
	title: 'Адреса'
}

export default async function AddressesPage() {
	const queryClient = getQueryClient()

	queryClient.prefetchQuery({
		queryKey: [ADDRESSES_QUERY_KEY],
		queryFn: () =>
			addressService.getMyAddresses({
				headers: { Cookie: cookies().toString() }
			})
	})

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CreateAddressButton />
			<MyAddressesList className='mt-3' />
		</HydrationBoundary>
	)
}
