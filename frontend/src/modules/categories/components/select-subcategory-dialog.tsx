'use client'

import { Suspense, useState } from 'react'

import { useCategories } from '../hooks/use-categories'
import { SubCategory } from '../models/sub-categories.types'

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from '@/core/components/ui/accordion'
import { Button } from '@/core/components/ui/button'
import { Checkbox } from '@/core/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import { ScrollArea } from '@/core/components/ui/scroll-area'
import { DialogProps } from '@/core/hooks/use-dialog.hook'
import { cn } from '@/core/lib/tailwind.utils'

interface SelectSubCategoryDialogProps extends DialogProps {
	onSelectSubCategory: (subCategory: SubCategory) => void
	initialSubCategory?: SubCategory
}

export const SelectSubCategoryDialog = ({
	isOpen,
	toggleDialog,
	onSelectSubCategory,
	initialSubCategory
}: SelectSubCategoryDialogProps) => {
	const { data: categories } = useCategories()

	const [selectedSubCategory, setSelectedSubCategory] = useState<
		SubCategory | undefined
	>(initialSubCategory)

	const handleOnSelectClick = () => {
		if (!selectedSubCategory) return
		onSelectSubCategory(selectedSubCategory)
		toggleDialog()
	}

	return (
		<Dialog
			open={isOpen}
			onOpenChange={toggleDialog}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Выберите подкатегорию</DialogTitle>
				</DialogHeader>

				<Suspense fallback={<p>Загрузка...</p>}>
					<div className='flex flex-col gap-2'>
						{categories.length === 0 && (
							<p className='mt-2 text-muted-foreground'>
								Подкатегории не найдены
							</p>
						)}

						<ScrollArea className={cn('flex w-full flex-col gap-3')}>
							{categories.map(category => (
								<GenericSelectListItem
									key={category.id}
									parentItem={{
										id: category.id,
										name: category.name,
										children: category.subCategories
									}}
									selectedChildId={selectedSubCategory?.id}
									onChildClick={setSelectedSubCategory}
									renderParentName={parent => parent.name}
									renderChildName={child => child.name}
								/>
							))}
						</ScrollArea>
					</div>
				</Suspense>

				<DialogFooter className='mt-4 gap-4 sm:justify-start'>
					<Button
						type='button'
						variant='default'
						disabled={!selectedSubCategory}
						onClick={handleOnSelectClick}
					>
						Выбрать
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

interface ParentWithChildren<T> {
	id: string
	name: string
	children: T[]
}

interface GenericSelectListItemProps<T extends { id: string; name: string }> {
	parentItem: ParentWithChildren<T>
	selectedChildId?: string
	onChildClick: (subCategory: T) => void
	renderParentName: (parent: ParentWithChildren<T>) => React.ReactNode
	renderChildName: (child: T) => React.ReactNode
}

const GenericSelectListItem = <T extends { id: string; name: string }>({
	parentItem,
	selectedChildId,
	onChildClick,
	renderParentName,
	renderChildName
}: GenericSelectListItemProps<T>) => {
	const isParentOpen = parentItem.children.some(
		child => child.id === selectedChildId
	)

	return (
		<Accordion
			type='single'
			collapsible
			defaultValue={isParentOpen ? parentItem.id : ''}
		>
			<AccordionItem
				value={parentItem.id}
				className='border-none'
			>
				<AccordionTrigger className='text-sm hover:no-underline'>
					{renderParentName(parentItem)}
				</AccordionTrigger>
				<AccordionContent className='flex flex-col gap-2 px-2'>
					{parentItem.children.map(child => (
						<button
							key={child.id}
							onClick={() => onChildClick(child)}
							className='flex w-full cursor-pointer items-center gap-4'
						>
							<Checkbox
								id={child.id}
								checked={selectedChildId === child.id}
								className='h-5 w-5 rounded-md border-gray-300'
							/>
							<label
								htmlFor={child.id}
								className='cursor-pointer text-sm font-normal'
							>
								{renderChildName(child)}
							</label>
						</button>
					))}
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	)
}
