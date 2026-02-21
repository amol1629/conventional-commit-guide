#!/usr/bin/env node

/**
 * Security Secret Generator CLI
 * Generates cryptographically secure secrets for the application
 *
 * Usage:
 *   node scripts/generate-secrets.js
 *   node scripts/generate-secrets.js --length 48
 *   node scripts/generate-secrets.js --type nextauth
 */

const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

// Parse command line arguments
const args = process.argv.slice(2)
const length = args.includes('--length')
	? parseInt(args[args.indexOf('--length') + 1])
	: 32
const type = args.includes('--type')
	? args[args.indexOf('--type') + 1]
	: 'general'
const output = args.includes('--output')
	? args[args.indexOf('--output') + 1]
	: null

/**
 * Generate a cryptographically secure random secret
 * @param {number} length - Length of the secret in bytes
 * @returns {string} Base64 encoded secret
 */
function generateSecureSecret(length = 32) {
	return crypto.randomBytes(length).toString('base64')
}

/**
 * Generate all required secrets for the application
 * @returns {Object} Object containing all secrets
 */
function generateAllSecrets() {
	return {
		nextAuthSecret: generateSecureSecret(32),
		jwtSecret: generateSecureSecret(32),
		encryptionKey: generateSecureSecret(16),
		sessionSecret: generateSecureSecret(24),
	}
}

/**
 * Generate environment file template
 * @returns {string} Template content
 */
function generateEnvTemplate() {
	const secrets = generateAllSecrets()
	const timestamp = new Date().toISOString()

	return `# Security Configuration Template
# Generated on: ${timestamp}
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
 * Main function
 */
function main() {
	console.log('🔐 Security Secret Generator')
	console.log('============================\n')

	if (type === 'all' || !type || type === 'general') {
		// Generate all secrets
		const secrets = generateAllSecrets()

		console.log('Generated Secrets:')
		console.log('==================')
		console.log(`NEXTAUTH_SECRET=${secrets.nextAuthSecret}`)
		console.log(`JWT_SECRET=${secrets.jwtSecret}`)
		console.log(`ENCRYPTION_KEY=${secrets.encryptionKey}`)
		console.log(`SESSION_SECRET=${secrets.sessionSecret}`)

		console.log('\n📋 Instructions:')
		console.log('1. Copy these secrets to your .env.local file')
		console.log('2. Replace placeholder values with your actual credentials')
		console.log('3. Never commit secrets to version control')
		console.log('4. Use different secrets for development and production')

		// Generate template file if requested
		if (output || args.includes('--template')) {
			const template = generateEnvTemplate()
			const outputPath = output || '.env.template'

			try {
				fs.writeFileSync(outputPath, template)
				console.log(`\n✅ Template saved to: ${outputPath}`)
			} catch (error) {
				console.error(`❌ Failed to save template: ${error.message}`)
			}
		}
	} else {
		// Generate single secret
		const secret = generateSecureSecret(length)

		console.log(`Generated ${type} secret (${length} bytes):`)
		console.log('=====================================')
		console.log(secret)

		console.log('\n📋 Instructions:')
		console.log(
			`1. Add this secret to your ${type.toUpperCase()}_SECRET environment variable`,
		)
		console.log('2. Ensure it meets your security requirements')
		console.log('3. Never commit this secret to version control')
	}

	console.log('\n🔒 Security Best Practices:')
	console.log('- Use at least 32 characters for critical secrets')
	console.log('- Rotate secrets regularly (every 90 days)')
	console.log('- Use different secrets for different environments')
	console.log('- Store secrets in environment variables, not code')
	console.log('- Use a secrets management service in production')
	console.log('- Monitor for suspicious activity')

	console.log('\n🛠️  Additional Commands:')
	console.log('node scripts/generate-secrets.js --type nextauth --length 48')
	console.log(
		'node scripts/generate-secrets.js --template --output .env.production',
	)
	console.log('node scripts/generate-secrets.js --type jwt --length 64')
}

// Run the script
if (require.main === module) {
	main()
}

module.exports = {
	generateSecureSecret,
	generateAllSecrets,
	generateEnvTemplate,
}
