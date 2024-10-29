import { useCallback, useState } from 'react'

export interface DialogProps {
	isOpen: boolean
	toggleDialog: () => void
}

export const useDialog = () => {
	const [isOpen, setIsOpen] = useState(false)

	const openDialog = useCallback(() => setIsOpen(true), [])
	const closeDialog = useCallback(() => setIsOpen(false), [])
	const toggleDialog = useCallback(() => setIsOpen(prev => !prev), [])

	return {
		isOpen,
		openDialog,
		closeDialog,
		toggleDialog
	}
}
