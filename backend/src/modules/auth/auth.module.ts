import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { APP_GUARD } from '@nestjs/core'
import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { getJwtConfig } from './config/jwt.config'
import { JwtAuthGuard } from './guards/jwt.guard'
import { JwtStrategy } from './jwt.strategy'
import { RolesGuard } from './roles/roles.guard'

@Module({
	imports: [
		UserModule,
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		JwtStrategy,
		JwtAuthGuard,
		{
			provide: APP_GUARD,
			useClass: RolesGuard,
		},
	],
})
export class AuthModule {}
