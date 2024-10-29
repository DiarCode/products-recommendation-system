'use client'

import dynamic from 'next/dynamic'

import { Pencil } from 'lucide-react'

import { Button } from '@/core/components/ui/button'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { Brands } from '@/modules/brands/models/brands.types'

const UpdateBrandDialog = dynamic(() =>
	import('./update-brand-dialog').then(m => m.UpdateBrandDialog)
)

interface UpdateBrandContainerProps {
	brand: Brands
}

export const UpdateBrandContainer = ({ brand }: UpdateBrandContainerProps) => {
	const { isOpen, toggleDialog } = useDialog()

	return (
		<div>
			<Button
				size='icon'
				variant='ghost'
				onClick={toggleDialog}
			>
				<Pencil className='h-5 w-5' />
			</Button>

			{isOpen && (
				<UpdateBrandDialog
					isOpen={isOpen}
					toggleDialog={toggleDialog}
					brand={brand}
				/>
			)}
		</div>
	)
}
