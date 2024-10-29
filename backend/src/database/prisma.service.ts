import { Injectable, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'
import { LoggerService } from '../modules/logger/logger.service'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor(private loggerService: LoggerService) {
		super()
	}

	async onModuleInit() {
		try {
			await this.$connect().then(() =>
				this.loggerService.log(`Connected to the database successfully`),
			)
		} catch (error) {
			this.loggerService.error('Failed to connect to the database', error)
			process.exit(1)
		}
	}
}
