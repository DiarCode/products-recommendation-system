'use client'

import dynamic from 'next/dynamic'

import React from 'react'

import { Button } from '@/core/components/ui/button'
import { useDialog } from '@/core/hooks/use-dialog.hook'

const CreateAddressDialog = dynamic(() =>
	import('./create-address-dialog').then(m => m.CreateAddressDialog)
)

export const CreateAddressButton = () => {
	const { isOpen, toggleDialog } = useDialog()

	return (
		<div>
			<Button
				variant='link'
				className='p-0'
				onClick={toggleDialog}
			>
				Добавить новый адрес
			</Button>

			{isOpen && (
				<CreateAddressDialog
					isOpen={isOpen}
					toggleDialog={toggleDialog}
				/>
			)}
		</div>
	)
}
