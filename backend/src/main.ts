import { NestFactory } from '@nestjs/core'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'
import helmet from 'helmet'

import { HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'
import { morganMiddleware } from './modules/logger/morgan.middleware'

async function bootstrap() {
	dotenv.config()
	const app = await NestFactory.create(AppModule)

	app.use(helmet())
	app.use(compression())

	app.setGlobalPrefix('/api/v1')
	app.use(cookieParser())
	app.enableVersioning()
	app.enableShutdownHooks()
	app.enableCors({
		origin: true,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
	})
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
			transform: true,
			dismissDefaultMessages: true,
			exceptionFactory: errors => new UnprocessableEntityException(errors),
		}),
	)

	app.use(morganMiddleware)

	await app.listen(process.env.PORT || 8080)
	console.info(`Server running on ${await app.getUrl()}`)
}

bootstrap()
