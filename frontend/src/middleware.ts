import { NextRequest, NextResponse } from 'next/server'

import { Tokens } from './modules/auth/models/auth-dto.types'
import { Roles } from './modules/users/models/users.types'
import { authService } from '@/modules/auth/services/auth.service'

const protectedRoutes = ['/admin', '/profile']
const permittedRoles = [Roles.ADMIN]
const authPages = ['/login', '/signup']

export async function middleware(request: NextRequest) {
	const { nextUrl, cookies } = request
	const path = nextUrl.pathname
	const token = cookies.get(Tokens.ACCESS)?.value

	const currentUser = token
		? await authService.getCurrentWithToken(token)
		: null

	if (currentUser) {
		if (authPages.includes(path)) {
			return NextResponse.redirect(new URL('/', nextUrl))
		}
	} else {
		if (token) {
			const response = NextResponse.next()
			response.cookies.delete(Tokens.ACCESS)
			response.cookies.delete(Tokens.REFRESH)
			return response
		}

		if (protectedRoutes.includes(path) || path.includes('/profile')) {
			return redirectToLogin(request)
		}
	}

	if (
		path.includes('/admin') &&
		(!currentUser || !permittedRoles.includes(currentUser.role))
	) {
		return redirectToLogin(request)
	}

	return NextResponse.next()
}

function redirectToLogin(req: NextRequest) {
	const loginUrl = new URL('/login', req.nextUrl)
	loginUrl.searchParams.set('redirect', req.nextUrl.pathname)
	return NextResponse.redirect(loginUrl)
}

export const config = {
	matcher: '/((?!api|static|.*\\..*|_next).*)'
}
