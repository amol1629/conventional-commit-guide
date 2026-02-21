import {
	sendAdminNotification,
	sendWelcomeEmail,
	verifyEmailConfig,
} from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { email, name, type, userName, userEmail } = await request.json()

		// Validate required fields
		if (!email || !name) {
			return NextResponse.json(
				{ success: false, error: 'Email and name are required' },
				{ status: 400 },
			)
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid email format' },
				{ status: 400 },
			)
		}

		// Check email configuration
		const configCheck = await verifyEmailConfig()
		if (!configCheck.success) {
			console.error('Email configuration error:', configCheck.error)
			return NextResponse.json(
				{
					success: false,
					error:
						'Email service is not properly configured. Please contact support.',
				},
				{ status: 500 },
			)
		}

		let result

		// Send email based on type
		switch (type) {
			case 'welcome':
				result = await sendWelcomeEmail(email, name)
				break
			case 'admin-notification':
				if (!userName || !userEmail) {
					return NextResponse.json(
						{
							success: false,
							error:
								'userName and userEmail are required for admin notifications',
						},
						{ status: 400 },
					)
				}
				result = await sendAdminNotification(userName, userEmail)
				break
			default:
				return NextResponse.json(
					{ success: false, error: 'Invalid email type' },
					{ status: 400 },
				)
		}

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: 'Email sent successfully',
				messageId: result.messageId,
			})
		} else {
			return NextResponse.json(
				{ success: false, error: result.error || 'Failed to send email' },
				{ status: 500 },
			)
		}
	} catch (error) {
		console.error('API error:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Internal server error',
			},
			{ status: 500 },
		)
	}
}

// Health check endpoint
export async function GET() {
	try {
		const configCheck = await verifyEmailConfig()

		if (configCheck.success) {
			return NextResponse.json({
				success: true,
				message: 'Email service is configured and ready',
				configured: true,
			})
		} else {
			return NextResponse.json(
				{
					success: false,
					message: 'Email service is not properly configured',
					configured: false,
					error: configCheck.error,
				},
				{ status: 500 },
			)
		}
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: 'Email service health check failed',
				configured: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}
