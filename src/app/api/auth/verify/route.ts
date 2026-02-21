import { authService } from '@/services/auth.service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { token } = body

		if (!token) {
			return NextResponse.json(
				{ success: false, error: 'Token is required' },
				{ status: 400 },
			)
		}

		const user = await authService.verifyToken(token)

		if (user) {
			return NextResponse.json({
				success: true,
				user: {
					id: user.id,
					email: user.email,
					name: user.name,
					avatar: user.avatar,
				},
			})
		} else {
			return NextResponse.json(
				{ success: false, error: 'Invalid or expired token' },
				{ status: 401 },
			)
		}
	} catch (error) {
		console.error('Token verification error:', error)
		return NextResponse.json(
			{ success: false, error: 'Token verification failed' },
			{ status: 500 },
		)
	}
}
