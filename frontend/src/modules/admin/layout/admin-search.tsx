'use client'

import {
	Calculator,
	Calendar,
	CreditCard,
	Search,
	Settings,
	Smile,
	User
} from 'lucide-react'
import * as React from 'react'

import { Button } from '@/core/components/ui/button'
import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
	CommandShortcut
} from '@/core/components/ui/command'

export function AdminSearch() {
	const [open, setOpen] = React.useState(false)

	const toggleCommandDialog = () => {
		setOpen(prev => !prev)
	}

	return (
		<>
			<Button
				size='icon'
				variant='ghost'
				onClick={toggleCommandDialog}
			>
				<Search className='h-5 w-5' />
			</Button>

			<CommandDialog
				open={open}
				onOpenChange={setOpen}
			>
				<CommandInput placeholder='Type a command or search...' />
				<CommandList>
					<CommandEmpty>No results found.</CommandEmpty>
					<CommandGroup heading='Suggestions'>
						<CommandItem>
							<Calendar className='mr-2 h-4 w-4' />
							<span>Calendar</span>
						</CommandItem>
						<CommandItem>
							<Smile className='mr-2 h-4 w-4' />
							<span>Search Emoji</span>
						</CommandItem>
						<CommandItem>
							<Calculator className='mr-2 h-4 w-4' />
							<span>Calculator</span>
						</CommandItem>
					</CommandGroup>
					<CommandSeparator />
					<CommandGroup heading='Settings'>
						<CommandItem>
							<User className='mr-2 h-4 w-4' />
							<span>Profile</span>
							<CommandShortcut>⌘P</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<CreditCard className='mr-2 h-4 w-4' />
							<span>Billing</span>
							<CommandShortcut>⌘B</CommandShortcut>
						</CommandItem>
						<CommandItem>
							<Settings className='mr-2 h-4 w-4' />
							<span>Settings</span>
							<CommandShortcut>⌘S</CommandShortcut>
						</CommandItem>
					</CommandGroup>
				</CommandList>
			</CommandDialog>
		</>
	)
}
