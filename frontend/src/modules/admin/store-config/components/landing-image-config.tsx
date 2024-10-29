'use client'

import Image from 'next/image'

import { useMutation } from '@tanstack/react-query'
import { Eye, Trash, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { UpdateStoreConfigDto } from '../models/store-config.types'
import { adminStoreConfigsService } from '../services/store-config.service'

import { Button } from '@/core/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle
} from '@/core/components/ui/dialog'
import { getLandingImageUrl } from '@/core/lib/images.utils'

type ImageProps = string | File

interface ProductImagesProps {
	initialImages: string[]
}

export const AdminStoreLandingImages = ({
	initialImages
}: ProductImagesProps) => {
	const [images, setImages] = useState<ImageProps[]>(initialImages)
	const [previewImage, setPreviewImage] = useState<string | null>(null)

	const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files) {
			const newImages = Array.from(files)
			setImages([...newImages, ...images])
		}
	}

	const handleDelete = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index)
		setImages(updatedImages)
	}

	const handlePreview = (image: string | File) => {
		const imageUrl =
			typeof image === 'string'
				? getLandingImageUrl(image)
				: URL.createObjectURL(image)
		setPreviewImage(imageUrl)
	}

	const { mutate: updateConfig } = useMutation({
		mutationFn: (dto: UpdateStoreConfigDto) =>
			adminStoreConfigsService.updateStoreConfig(dto),
		onSuccess: () => {
			toast.success('Конфигурация успешно обновлена')
		},
		onError: () => {
			toast.error('Ошибка при обновлении конфигурации')
		}
	})

	const onSaveClick = () => {
		const uploadedImages = images.filter(image => typeof image !== 'string')

		const imagesToDelete = initialImages.filter(
			image => !images.includes(image)
		)

		const dto: UpdateStoreConfigDto = {
			landingImagesToDelete: imagesToDelete,
			landingImages: uploadedImages
		}

		updateConfig(dto)
	}

	return (
		<Card className='shadow-none'>
			<CardHeader>
				<div className='flex items-start justify-between gap-4'>
					<div className='space-y-2'>
						<CardTitle className='text-lg'>Изображения для лендинга</CardTitle>
						<CardDescription>
							Загрузите изображения размером примерно 1400x470 пикселей
							(пропорция 3:1) для карусели на лендинге.
						</CardDescription>
					</div>

					<Button
						onClick={onSaveClick}
						variant='outline'
						type='button'
					>
						Сохранить
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className='flex flex-wrap gap-4'>
					{images.map((img, index) => (
						<ImageWithActions
							key={
								typeof img === 'string'
									? getLandingImageUrl(img)
									: URL.createObjectURL(img)
							}
							src={
								typeof img === 'string'
									? getLandingImageUrl(img)
									: URL.createObjectURL(img)
							}
							index={index}
							handleDelete={() => handleDelete(index)}
							handlePreview={() => handlePreview(img)}
						/>
					))}
					<label className='flex aspect-square h-[180px] w-[180px] cursor-pointer items-center justify-center rounded-md border border-dashed'>
						<Upload className='h-4 w-4 text-muted-foreground' />
						<input
							type='file'
							accept='image/*'
							onChange={handleUpload}
							className='sr-only'
							multiple
						/>
						<span className='sr-only'>Загрузить</span>
					</label>
				</div>
			</CardContent>

			{previewImage && (
				<Dialog
					open={Boolean(previewImage)}
					onOpenChange={() => setPreviewImage(null)}
				>
					<DialogContent className='max-h-[95vh] max-w-[90vw]'>
						<DialogHeader>
							<DialogTitle>Предварительный просмотр</DialogTitle>
						</DialogHeader>

						<div className='relative aspect-[3/1] max-h-[470px] w-full max-w-[1400px] bg-muted/60'>
							<Image
								src={previewImage}
								alt='Предварительный просмотр'
								className='rounded-2xl object-cover object-center'
								loading='lazy'
								fill
							/>
						</div>
					</DialogContent>
				</Dialog>
			)}
		</Card>
	)
}

interface ImageWithActionsProps {
	src: string
	index: number
	handleDelete: () => void
	handlePreview: () => void
}

const ImageWithActions = ({
	src,
	index,
	handleDelete,
	handlePreview
}: ImageWithActionsProps) => (
	<div className='group relative aspect-square h-[180px] w-[180px] rounded-md'>
		<Image
			alt={`Изображение товара ${index + 1}`}
			className='h-full w-full rounded-md border object-contain transition-transform duration-200 ease-in-out'
			height={180}
			src={src}
			width={180}
		/>
		<div className='absolute right-4 top-4 z-10 hidden items-center space-x-3 group-hover:flex'>
			<button
				onClick={handlePreview}
				className='items-center justify-center rounded-full bg-background text-foreground hover:text-primary'
			>
				<Eye className='h-6 w-6' />
			</button>
			<button
				onClick={handleDelete}
				className='items-center justify-center rounded-full bg-background text-destructive'
			>
				<Trash className='h-5 w-5' />
			</button>
		</div>
	</div>
)
