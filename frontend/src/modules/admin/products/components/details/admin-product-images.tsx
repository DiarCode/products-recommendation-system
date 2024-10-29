import Image from 'next/image'

import { Trash, Upload } from 'lucide-react'
import { Dispatch, SetStateAction } from 'react'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/core/components/ui/card'
import { getProductImageUrl } from '@/core/lib/images.utils'

type ImageProps = string | File

interface ProductImagesProps {
	images: ImageProps[]
	setImages: Dispatch<SetStateAction<ImageProps[]>>
}

interface DraggableImageProps {
	src: string
	index: number
	handleDelete: () => void
}

const ImageWithDelete = ({ src, index, handleDelete }: DraggableImageProps) => (
	<div className='group relative aspect-square w-full rounded-md'>
		<Image
			alt={`Изображение товара ${index + 1}`}
			className='aspect-square w-full rounded-md border object-contain transition-transform duration-200 ease-in-out'
			height={84}
			src={src}
			width={84}
		/>
		<button
			onClick={handleDelete}
			className='absolute right-2 top-2 z-10 hidden items-center justify-center rounded-full bg-background text-destructive group-hover:flex'
		>
			<Trash className='h-4 w-4' />
		</button>
	</div>
)

export const AdminProductImages = ({
	images,
	setImages
}: ProductImagesProps) => {
	const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files
		if (files) {
			const newImages = Array.from(files) // Store File objects
			setImages([...newImages, ...images])
		}
	}

	const handleDelete = (index: number) => {
		const updatedImages = images.filter((_, i) => i !== index)
		setImages(updatedImages)
	}

	return (
		<Card className='shadow-none'>
			<CardHeader className='space-y-2'>
				<CardTitle className='text-lg'>Изображения</CardTitle>
				<CardDescription>
					Вы можете добавлять, удалять изображения для улучшения визуального
					представления товара.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='mb-4 flex justify-center'>
					{images.length > 0 && (
						<Image
							alt='Изображение товара'
							className='aspect-square w-full max-w-[300px] rounded-md border object-contain'
							height={300}
							src={
								typeof images[0] === 'string'
									? getProductImageUrl(images[0])
									: URL.createObjectURL(images[0])
							}
							width={300}
						/>
					)}
				</div>
				<div className='grid grid-cols-3 gap-2'>
					{images.map((img, index) => (
						<ImageWithDelete
							key={
								typeof img === 'string'
									? getProductImageUrl(img)
									: URL.createObjectURL(img)
							}
							src={
								typeof img === 'string'
									? getProductImageUrl(img)
									: URL.createObjectURL(img)
							}
							index={index}
							handleDelete={() => handleDelete(index)}
						/>
					))}
					<label className='flex aspect-square w-full cursor-pointer items-center justify-center rounded-md border border-dashed'>
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
		</Card>
	)
}
