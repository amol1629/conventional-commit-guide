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

		// Send test welcome email using Resend
		const result = await sendWelcomeEmail(email, name)

		if (result.success) {
			return NextResponse.json({
				success: true,
				message: 'Resend email sent successfully',
				messageId: result.messageId,
			})
		} else {
			return NextResponse.json(
				{ success: false, error: result.error || 'Failed to send email' },
				{ status: 500 },
			)
		}
	} catch (error) {
		console.error('Resend test API error:', error)
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

// Health check endpoint for Resend
export async function GET() {
	try {
		const configCheck = await verifyEmailConfig()

		if (configCheck.success) {
			return NextResponse.json({
				success: true,
				message: 'Resend email service is configured and ready',
				configured: true,
			})
		} else {
			return NextResponse.json(
				{
					success: false,
					message: 'Resend email service is not properly configured',
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
				message: 'Resend email service health check failed',
				configured: false,
				error: error instanceof Error ? error.message : 'Unknown error',
			},
			{ status: 500 },
		)
	}
}

