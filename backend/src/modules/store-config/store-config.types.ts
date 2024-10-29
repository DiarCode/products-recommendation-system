import { Transform } from 'class-transformer'
import { IsArray, IsOptional, IsString } from 'class-validator'

export class UpdateStoreConfigDto {
	@IsOptional()
	@IsString()
	storeName?: string

	@IsOptional()
	@IsString()
	storeDescription?: string

	@IsOptional()
	@IsString()
	storeKeywords?: string

	@IsOptional()
	@Transform(({ value }) => {
		try {
			return typeof value === 'string' ? JSON.parse(value) : value
		} catch {
			return value
		}
	})
	@IsArray()
	@IsString({ each: true })
	landingImagesToDelete?: string[]
}
