import { CreateAddressDto, UpdateAddressDto } from '../models/address-dto.types'
import { Address } from '../models/address.types'

import { fetchWrapper } from '@/core/api/fetch-instance'

class AddressService {
	private baseUrl = `/api/v1/addresses`

	async createAddress(dto: CreateAddressDto): Promise<void> {
		try {
			await fetchWrapper.post<void>(this.baseUrl, dto)
		} catch (e) {
			console.error(e)
		}
	}

	async updateAddress(dto: UpdateAddressDto): Promise<void> {
		try {
			await fetchWrapper.put<void>(`${this.baseUrl}/${dto.id}`, dto)
		} catch (e) {
			console.error(e)
		}
	}

	async deleteAddress(id: string): Promise<void> {
		try {
			await fetchWrapper.delete<void>(`${this.baseUrl}/${id}`)
		} catch (e) {
			console.error(e)
		}
	}

	async getMyAddresses(config?: {
		headers?: Record<string, string>
	}): Promise<Address[]> {
		try {
			return await fetchWrapper.get<Address[]>(`${this.baseUrl}`, config)
		} catch {
			return [] as Address[]
		}
	}

	async getAddressById(id: string): Promise<Address | null> {
		try {
			return await fetchWrapper.get<Address>(`${this.baseUrl}/${id}`)
		} catch {
			return null
		}
	}
}

export const addressService = new AddressService()
