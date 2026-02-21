import { sendWelcomeEmail, verifyEmailConfig } from '@/lib/email'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { email, name } = await request.json()

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
			return NextResponse.json(
				{
					success: false,
					error: 'Email service is not properly configured',
					details: configCheck.error,
				},
				{ status: 500 },
			)
		}

		// Send test welcome email
		const result = await sendWelcomeEmail(email, name)

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: 'Test email sent successfully',
				messageId: result.messageId,
			})
		} else {
			return NextResponse.json(
				{ success: false, error: result.error || 'Failed to send test email' },
				{ status: 500 },
			)
		}
	} catch (error) {
		console.error('Test email API error:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Internal server error',
				details: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}

