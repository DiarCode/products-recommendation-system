'use client'

import dynamic from 'next/dynamic'

import { Plus } from 'lucide-react'

import { Button } from '@/core/components/ui/button'
import { useDialog } from '@/core/hooks/use-dialog.hook'

const CreateBrandCategoryDialog = dynamic(() =>
	import('./create-brand-category-dialog').then(
		m => m.CreateBrandCategoryDialog
	)
)

interface CreateBrandCategoryContainerProps {
	brandId: string
}

export const CreateBrandCategoryContainer = ({
	brandId
}: CreateBrandCategoryContainerProps) => {
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
				<CreateBrandCategoryDialog
					brandId={brandId}
					isOpen={isOpen}
					toggleDialog={toggleDialog}
				/>
			)}
		</div>
	)
}
