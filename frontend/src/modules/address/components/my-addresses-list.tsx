'use client'

import dynamic from 'next/dynamic'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

import { ADDRESSES_QUERY_KEY, useAddresses } from '../hooks/use-adresses.hook'
import { Address } from '../models/address.types'
import { addressService } from '../services/address.service'

import { Button } from '@/core/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { cn } from '@/core/lib/tailwind.utils'

const UpdateAddressDialog = dynamic(() =>
	import('./update-address/update-address-dialog').then(
		m => m.UpdateAddressDialog
	)
)

interface MyAddressesListProps {
	className?: string
}

export const MyAddressesList = ({ className }: MyAddressesListProps) => {
	const queryClient = useQueryClient()

	const { data: addresses } = useAddresses()
	const { isOpen, toggleDialog } = useDialog()
	const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)

	const { mutate } = useMutation({
		mutationFn: (id: string) => addressService.deleteAddress(id),
		onSuccess: () => {
			toast.success('Адрес успешно удален')
			queryClient.invalidateQueries({ queryKey: [ADDRESSES_QUERY_KEY] })
		},
		onError: () => {
			toast.error('Ошибка при удалении адреса')
		}
	})

	const handleEditClick = (address: Address) => {
		setSelectedAddress(address)
		toggleDialog()
	}

	const handleDeleteClick = (address: Address) => {
		mutate(address.id)
	}

	return (
		<Suspense fallback={<p>Загрузка...</p>}>
			{addresses.length === 0 && (
				<p className='mt-2 text-muted-foreground'>
					У вас еще нет сохраненных адресов
				</p>
			)}
			<div
				className={cn(
					'grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3',
					className
				)}
			>
				{addresses.map((address, i) => (
					<div
						key={address.id}
						className='group relative rounded-xl border p-4'
					>
						<div className='flex items-start justify-between gap-3'>
							<p className='font-bold'>Адрес #{i + 1}</p>

							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										className='h-6 w-6 group-hover:flex'
										size='icon'
										variant='ghost'
									>
										<EllipsisVertical className='h-4 w-4 text-muted-foreground' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuItem onClick={() => handleEditClick(address)}>
										Изменить
									</DropdownMenuItem>

									<DropdownMenuItem onClick={() => handleDeleteClick(address)}>
										Удалить
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>

						<p className='line mt-2 line-clamp-2 text-ellipsis'>
							{[address.city, address.address].join(', ')}
						</p>
					</div>
				))}

				{isOpen && selectedAddress && (
					<UpdateAddressDialog
						isOpen={isOpen}
						toggleDialog={toggleDialog}
						address={selectedAddress}
					/>
				)}
			</div>
		</Suspense>
	)
}
