'use client'

import dynamic from 'next/dynamic'

import { Plus } from 'lucide-react'

import { Button } from '@/core/components/ui/button'
import { useDialog } from '@/core/hooks/use-dialog.hook'

const CreateSubCategoryDialog = dynamic(() =>
	import('./create-subcategory-dialog').then(m => m.CreateSubCategoryDialog)
)

interface CreateSubCategoryContainerProps {
	categoryId: string
}

export const CreateSubCategoryContainer = ({
	categoryId
}: CreateSubCategoryContainerProps) => {
	const { isOpen, toggleDialog } = useDialog()

	return (
		<div>
			<Button
				className='gap-2'
				onClick={toggleDialog}
			>
				<Plus className='h-4 w-4' />
				<span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
					Добавить
				</span>
			</Button>

			{isOpen && (
				<CreateSubCategoryDialog
					categoryId={categoryId}
					isOpen={isOpen}
					toggleDialog={toggleDialog}
				/>
			)}
		</div>
	)
}
