import { useSuspenseQuery } from '@tanstack/react-query'

import { addressService } from '../services/address.service'

export const ADDRESSES_QUERY_KEY = 'address:my-address'

export const useAddresses = () => {
	return useSuspenseQuery({
		queryKey: [ADDRESSES_QUERY_KEY],
		queryFn: () => addressService.getMyAddresses()
	})
}
