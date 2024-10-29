import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'
import { createLogger, format, Logger, transports } from 'winston'

const { combine, timestamp, printf, colorize, errors, json } = format

const logDir = path.resolve(process.cwd(), 'logs')
if (!fs.existsSync(logDir)) {
	fs.mkdirSync(logDir)
}

const loggerFormat = printf(({ level, message, timestamp, stack }) => {
	return `${timestamp} [${level}] ${message} ${stack ? `\nTrace: ${stack}` : ''}`
})

const logger: Logger = createLogger({
	level: 'info',
	format: combine(
		timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		errors({ stack: true }),
		loggerFormat,
	),
	transports: [
		new transports.Console({
			format: combine(colorize(), loggerFormat),
		}),
		new transports.File({
			level: 'info',
			filename: path.join(logDir, 'application.log'),
			format: json(),
		}),
		new transports.File({
			level: 'error',
			filename: path.join(logDir, 'errors.log'),
			format: json(),
		}),
	],
})

interface LogMessage {
	message: string
	level: string
	timestamp: string
	trace?: string
}

@Injectable()
export class LoggerService implements NestLoggerService {
	log(message: string) {
		logger.info(this.formatMessage(message))
	}

	error(message: string, trace?: string) {
		logger.error(this.formatMessage(message, trace))
	}

	warn(message: string) {
		logger.warn(this.formatMessage(message))
	}

	debug(message: string) {
		logger.debug(this.formatMessage(message))
	}

	verbose(message: string) {
		logger.verbose(this.formatMessage(message))
	}

	private formatMessage(message: string, trace?: string): LogMessage {
		const timestamp = new Date().toISOString()
		return {
			message,
			level: 'info',
			timestamp,
			trace,
		}
	}
}
