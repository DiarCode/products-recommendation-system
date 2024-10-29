'use client'

import dynamic from 'next/dynamic'

import { Pencil } from 'lucide-react'

import { Button } from '@/core/components/ui/button'
import { useDialog } from '@/core/hooks/use-dialog.hook'
import { Category } from '@/modules/categories/models/categories.types'

const UpdateCategoryDialog = dynamic(() =>
	import('./update-category-dialog').then(m => m.UpdateCategoryDialog)
)

interface UpdateCategoryContainerProps {
	category: Category
}

export const UpdateCategoryContainer = ({
	category
}: UpdateCategoryContainerProps) => {
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
				<UpdateCategoryDialog
					isOpen={isOpen}
					toggleDialog={toggleDialog}
					category={category}
				/>
			)}
		</div>
	)
}
