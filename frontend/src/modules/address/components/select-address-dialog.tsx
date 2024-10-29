'use client'

import dynamic from 'next/dynamic'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EllipsisVertical } from 'lucide-react'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

import { ADDRESSES_QUERY_KEY, useAddresses } from '../hooks/use-adresses.hook'
import { Address } from '../models/address.types'
import { addressService } from '../services/address.service'

import { CreateAddressButton } from './create-address/create-address-button'
import { Button } from '@/core/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/core/components/ui/dropdown-menu'
import { DialogProps, useDialog } from '@/core/hooks/use-dialog.hook'
import { cn } from '@/core/lib/tailwind.utils'

const UpdateAddressDialog = dynamic(() =>
	import('./update-address/update-address-dialog').then(
		m => m.UpdateAddressDialog
	)
)

interface SelectAddressDialogProps extends DialogProps {
	onSelectAddress: (address: Address) => void
}

export const SelectAddressDialog = ({
	isOpen,
	toggleDialog,
	onSelectAddress
}: SelectAddressDialogProps) => {
	const { data } = useAddresses()
	const queryClient = useQueryClient()
	const { isOpen: isUpdateOpen, toggleDialog: toggleUpdateDialog } = useDialog()
	const [selectedUpdateAddress, setSelectedUpdateAddress] =
		useState<Address | null>(null)
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
		setSelectedUpdateAddress(address)
		toggleUpdateDialog()
	}

	const handleDeleteClick = (address: Address) => {
		mutate(address.id)
	}

	const handleOnSelectClick = () => {
		if (!selectedAddress) return

		onSelectAddress(selectedAddress)
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Выберите ваш адрес доставки</DialogTitle>
				</DialogHeader>

				<Suspense fallback={<p>Загрузка...</p>}>
					<div className='flex flex-col gap-2'>
						{data.length === 0 && (
							<p className='mt-2 text-muted-foreground'>
								У вас еще нет сохраненных адресов
							</p>
						)}

						{data.map(address => (
							<div
								key={address.id}
								className={cn(
									'cursor-pointer rounded-xl border p-4',
									address.id === selectedAddress?.id && 'border-primary'
								)}
								onClick={() => setSelectedAddress(address)}
							>
								<div className='flex items-start justify-between gap-3'>
									<p className='font-medium'>
										{[address.city, address.address].join(', ')}
									</p>

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
											<DropdownMenuItem
												onClick={() => handleEditClick(address)}
											>
												Изменить
											</DropdownMenuItem>

											<DropdownMenuItem
												onClick={() => handleDeleteClick(address)}
											>
												Удалить
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</div>
						))}
					</div>
				</Suspense>

				{isUpdateOpen && selectedUpdateAddress && (
					<UpdateAddressDialog
						isOpen={isUpdateOpen}
						toggleDialog={toggleUpdateDialog}
						address={selectedUpdateAddress}
					/>
				)}

				<DialogFooter className='mt-4 gap-4 sm:justify-start'>
					<Button
						type='button'
						variant='default'
						disabled={!selectedAddress}
						onClick={handleOnSelectClick}
					>
						Выбрать
					</Button>

					<CreateAddressButton />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
