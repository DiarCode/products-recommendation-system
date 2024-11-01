import Link from 'next/link'

import { Separator } from '@/core/components/ui/separator'

const data = [
	{
		label: 'Покупателям',
		links: [
			{
				label: 'Конфидициальность',
				url: '/'
			},
			{
				label: 'Соглашение',
				url: '/'
			}
		]
	},
	{
		label: 'Ресурсы',
		links: [
			{
				label: 'Блог',
				url: '/'
			},
			{
				label: 'О нас',
				url: '/'
			},
			{
				label: 'Контакты',
				url: '/'
			}
		]
	},
	{
		label: 'Поддержка',
		links: [
			{
				label: 'Телеграм',
				url: '/'
			},
			{
				label: 'Вопросы и ответы',
				url: '/'
			}
		]
	}
]

export const PrimaryFooter = () => {
	return (
		<footer className='w-full py-6'>
			<Separator className='my-12' />
			<div className='flex justify-between'>
				<Trademark />
				<Links />
			</div>
		</footer>
	)
}

const Links = () => {
	return (
		<div className='grid grid-cols-2 justify-evenly gap-8 text-end sm:grid-cols-3 sm:gap-6'>
			{data.map(({ label, links }) => (
				<div key={label}>
					<h2 className='mb-3 text-sm font-medium'>{label}</h2>
					<ul className='block space-y-1'>
						{links.map(({ label, url }) => (
							<li key={label}>
								<Link
									href={url}
									className='text-sm text-muted-foreground transition duration-300 hover:text-foreground'
								>
									{label}
								</Link>
							</li>
						))}
					</ul>
				</div>
			))}
		</div>
	)
}

const Trademark = () => {
	return (
		<div className='mb-6 hidden md:mb-0 md:block'>
			<span className='flex flex-col'>
				<h2 className='whitespace-nowrap text-sm font-semibold uppercase'>
					Tekno
				</h2>
				<span className='mt-2 text-sm text-neutral-500 dark:text-neutral-400'>
					© {new Date().getFullYear()} Tekno . Все права защищены.
				</span>
			</span>
		</div>
	)
}
