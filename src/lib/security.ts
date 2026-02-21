import crypto from 'crypto'

/**
 * Security utilities for generating and validating secrets
 * Implements security best practices for production applications
 */

export interface SecurityConfig {
	nextAuthSecret: string
	jwtSecret: string
	mongoUri: string
	googleClientId: string
	googleClientSecret: string
	githubClientId: string
	githubClientSecret: string
	smtpHost: string
	smtpPort: string
	smtpUser: string
	smtpPass: string
	appUrl: string
}

/**
 * Generate a cryptographically secure random secret
 * @param length - Length of the secret in bytes (default: 32)
 * @returns Base64 encoded secret
 */
export function generateSecureSecret(length: number = 32): string {
	return crypto.randomBytes(length).toString('base64')
}

/**
 * Generate multiple secrets for the application
 * @returns Object containing all required secrets
 */
export function generateAllSecrets() {
	return {
		nextAuthSecret: generateSecureSecret(32),
		jwtSecret: generateSecureSecret(32),
		// Generate additional secrets for other services if needed
		encryptionKey: generateSecureSecret(16),
		sessionSecret: generateSecureSecret(24),
	}
}

/**
 * Validate that a secret meets security requirements
 * @param secret - The secret to validate
 * @param minLength - Minimum length required (default: 32)
 * @returns Validation result
 */
export function validateSecret(
	secret: string,
	minLength: number = 32,
): {
	isValid: boolean
	errors: string[]
} {
	const errors: string[] = []

	if (!secret) {
		errors.push('Secret is required')
		return { isValid: false, errors }
	}

	if (secret.length < minLength) {
		errors.push(`Secret must be at least ${minLength} characters long`)
	}

	// Check for common weak patterns
	const weakPatterns = [
		/^[a-z]+$/i, // Only letters
		/^[0-9]+$/, // Only numbers
		/^(.)\1+$/, // Repeated characters
		/^(password|secret|key|admin|test|dev|123|abc)/i, // Common weak patterns
	]

	for (const pattern of weakPatterns) {
		if (pattern.test(secret)) {
			errors.push('Secret contains weak patterns')
			break
		}
	}

	// Check for sufficient entropy (basic check)
	const uniqueChars = new Set(secret).size
	if (uniqueChars < 8) {
		errors.push('Secret has insufficient character diversity')
	}

	return {
		isValid: errors.length === 0,
		errors,
	}
}

/**
 * Validate all environment variables for security
 * @returns Validation result with any security issues
 */
export function validateEnvironmentSecurity(): {
	isValid: boolean
	errors: string[]
	warnings: string[]
} {
	const errors: string[] = []
	const warnings: string[] = []

	// Check NEXTAUTH_SECRET
	const nextAuthSecret = process.env.NEXTAUTH_SECRET
	if (!nextAuthSecret) {
		errors.push('NEXTAUTH_SECRET is required')
	} else {
		const validation = validateSecret(nextAuthSecret, 32)
		if (!validation.isValid) {
			errors.push(`NEXTAUTH_SECRET: ${validation.errors.join(', ')}`)
		}
	}

	// Check JWT_SECRET
	const jwtSecret = process.env.JWT_SECRET
	if (!jwtSecret) {
		errors.push('JWT_SECRET is required')
	} else {
		const validation = validateSecret(jwtSecret, 32)
		if (!validation.isValid) {
			errors.push(`JWT_SECRET: ${validation.errors.join(', ')}`)
		}
	}

	// Check for default/weak values
	const weakSecrets = [
		'your-secret-key-change-in-production',
		'your-nextauth-secret',
		'your-jwt-secret',
		'secret',
		'password',
		'123456',
		'admin',
		'test',
		'dev',
	]

	for (const weakSecret of weakSecrets) {
		if (nextAuthSecret === weakSecret) {
			errors.push('NEXTAUTH_SECRET uses a default/weak value')
		}
		if (jwtSecret === weakSecret) {
			errors.push('JWT_SECRET uses a default/weak value')
		}
	}

	// Check for production environment
	if (process.env.NODE_ENV === 'production') {
		// Additional production security checks
		if (process.env.NEXTAUTH_URL?.includes('localhost')) {
			warnings.push('NEXTAUTH_URL should not use localhost in production')
		}

		if (process.env.MONGODB_URI?.includes('localhost')) {
			warnings.push('MongoDB URI should not use localhost in production')
		}

		// Check for HTTPS in production
		if (
			process.env.NEXTAUTH_URL &&
			!process.env.NEXTAUTH_URL.startsWith('https://')
		) {
			warnings.push('NEXTAUTH_URL should use HTTPS in production')
		}
	}

	return {
		isValid: errors.length === 0,
		errors,
		warnings,
	}
}

/**
 * Get security recommendations for the current environment
 * @returns Array of security recommendations
 */
export function getSecurityRecommendations(): string[] {
	const recommendations: string[] = []

	// Environment-specific recommendations
	if (process.env.NODE_ENV === 'production') {
		recommendations.push('Use HTTPS for all URLs in production')
		recommendations.push('Enable MongoDB authentication')
		recommendations.push('Use environment-specific database names')
		recommendations.push('Enable MongoDB SSL/TLS')
		recommendations.push('Set up proper CORS policies')
		recommendations.push('Use a dedicated email service (Resend, SendGrid)')
		recommendations.push('Enable rate limiting for API endpoints')
		recommendations.push('Set up proper logging and monitoring')
	}

	// General recommendations
	recommendations.push('Rotate secrets regularly (every 90 days)')
	recommendations.push('Use different secrets for different environments')
	recommendations.push('Never commit secrets to version control')
	recommendations.push('Use a secrets management service in production')
	recommendations.push('Enable 2FA for all service accounts')
	recommendations.push('Monitor for suspicious activity')

	return recommendations
}

/**
 * Generate a secure configuration template
 * @returns Template with generated secrets
 */
export function generateSecureConfigTemplate(): string {
	const secrets = generateAllSecrets()

	return `# Security Configuration Template
# Generated on: ${new Date().toISOString()}
#
# IMPORTANT: Replace these with your actual values and never commit to version control

# Authentication Secrets
NEXTAUTH_SECRET=${secrets.nextAuthSecret}
JWT_SECRET=${secrets.jwtSecret}

# Additional Security Keys
ENCRYPTION_KEY=${secrets.encryptionKey}
SESSION_SECRET=${secrets.sessionSecret}

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database Configuration
MONGODB_URI=your-mongodb-connection-string

# Email Configuration
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-resend-api-key

# App Configuration
NEXTAUTH_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Security Notes:
# - All secrets are cryptographically secure
# - Minimum 32 characters for critical secrets
# - Generated using crypto.randomBytes()
# - Replace placeholder values with actual credentials
# - Never commit this file to version control
`
}

/**
 * Security middleware for API routes
 * Validates environment security on startup
 */
export function validateSecurityOnStartup(): void {
	const validation = validateEnvironmentSecurity()

	if (!validation.isValid) {
		console.error('🚨 Security Validation Failed:')
		validation.errors.forEach((error) => console.error(`  ❌ ${error}`))

		if (process.env.NODE_ENV === 'production') {
			console.error(
				'❌ Application cannot start with security issues in production',
			)
			process.exit(1)
		} else {
			console.warn('⚠️  Security issues detected in development mode')
		}
	}

	if (validation.warnings.length > 0) {
		console.warn('⚠️  Security Warnings:')
		validation.warnings.forEach((warning) => console.warn(`  ⚠️  ${warning}`))
	}

	if (validation.isValid && validation.warnings.length === 0) {
		console.log('✅ Security validation passed')
	}
}
