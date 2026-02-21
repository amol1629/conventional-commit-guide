import {
	generateAllSecrets,
	generateSecureConfigTemplate,
	generateSecureSecret,
	getSecurityRecommendations,
	validateEnvironmentSecurity,
} from '@/lib/security'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Security validation and secret generation API
 * Provides tools for security best practices
 */

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const action = searchParams.get('action')

		switch (action) {
			case 'validate':
				return handleValidation()
			case 'generate':
				return handleGenerate()
			case 'recommendations':
				return handleRecommendations()
			case 'template':
				return handleTemplate()
			default:
				return NextResponse.json({
					success: false,
					error:
						'Invalid action. Use: validate, generate, recommendations, or template',
				})
		}
	} catch (error) {
		console.error('Security API error:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Internal server error',
			},
			{ status: 500 },
		)
	}
}

/**
 * Validate current environment security
 */
async function handleValidation() {
	const validation = validateEnvironmentSecurity()
	const recommendations = getSecurityRecommendations()

	return NextResponse.json({
		success: true,
		validation: {
			isValid: validation.isValid,
			errors: validation.errors,
			warnings: validation.warnings,
		},
		recommendations,
		timestamp: new Date().toISOString(),
	})
}

/**
 * Generate new secure secrets
 */
async function handleGenerate() {
	const secrets = generateAllSecrets()

	return NextResponse.json({
		success: true,
		secrets,
		instructions: {
			nextAuthSecret: 'Add to NEXTAUTH_SECRET environment variable',
			jwtSecret: 'Add to JWT_SECRET environment variable',
			encryptionKey: 'Add to ENCRYPTION_KEY environment variable (optional)',
			sessionSecret: 'Add to SESSION_SECRET environment variable (optional)',
		},
		security: {
			algorithm: 'crypto.randomBytes()',
			length: '32 bytes (256 bits)',
			entropy: 'Cryptographically secure',
		},
		timestamp: new Date().toISOString(),
	})
}

/**
 * Get security recommendations
 */
async function handleRecommendations() {
	const recommendations = getSecurityRecommendations()
	const validation = validateEnvironmentSecurity()

	return NextResponse.json({
		success: true,
		recommendations,
		currentIssues: {
			errors: validation.errors,
			warnings: validation.warnings,
		},
		priority: {
			critical: validation.errors.length > 0,
			important: validation.warnings.length > 0,
		},
		timestamp: new Date().toISOString(),
	})
}

/**
 * Generate secure configuration template
 */
async function handleTemplate() {
	const template = generateSecureConfigTemplate()

	return NextResponse.json({
		success: true,
		template,
		instructions: [
			'Copy the template to your .env.local file',
			'Replace placeholder values with your actual credentials',
			'Never commit this file to version control',
			'Use different values for development and production',
		],
		timestamp: new Date().toISOString(),
	})
}

/**
 * Generate a single secure secret
 */
export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { length = 32, type = 'general' } = body

		if (length < 16 || length > 64) {
			return NextResponse.json({
				success: false,
				error: 'Length must be between 16 and 64 characters',
			})
		}

		const secret = generateSecureSecret(length)

		return NextResponse.json({
			success: true,
			secret,
			metadata: {
				length,
				type,
				algorithm: 'crypto.randomBytes()',
				entropy: 'Cryptographically secure',
			},
			timestamp: new Date().toISOString(),
		})
	} catch (error) {
		console.error('Secret generation error:', error)
		return NextResponse.json(
			{
				success: false,
				error: 'Failed to generate secret',
			},
			{ status: 500 },
		)
	}
}
