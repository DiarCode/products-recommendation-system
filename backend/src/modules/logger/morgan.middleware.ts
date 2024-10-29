import * as morgan from 'morgan'
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, printf, colorize } = format

const loggerFormat = printf(({ level, message, timestamp }) => {
	return `${timestamp} [${level}] ${message}`
})

const httpLogger = createLogger({
	level: 'http',
	format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), loggerFormat),
	transports: [
		new transports.Console({
			format: combine(colorize(), loggerFormat),
		}),
		new transports.File({
			filename: 'http.log',
			format: loggerFormat,
		}),
	],
})

export const morganMiddleware = morgan(
	':method :url :status :res[content-length] - :response-time ms',
	{
		stream: {
			write: (message: string) => httpLogger.http(message.trim()),
		},
	},
)
