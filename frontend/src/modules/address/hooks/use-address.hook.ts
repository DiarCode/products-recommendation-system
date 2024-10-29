import { useQuery, useSuspenseQuery } from '@tanstack/react-query'

import { addressService } from '../services/address.service'

export const ADDRESS_QUERY_KEY = 'address:details'

export const useAddress = (id: string | null) => {
	return useQuery({
		queryKey: [ADDRESS_QUERY_KEY, id],
		queryFn: () => addressService.getAddressById(id!),
		enabled: Boolean(id)
	})
}
