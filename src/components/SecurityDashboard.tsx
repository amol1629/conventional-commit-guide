'use client'

import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface SecurityValidation {
	isValid: boolean
	errors: string[]
	warnings: string[]
}

interface SecurityRecommendations {
	recommendations: string[]
	currentIssues: {
		errors: string[]
		warnings: string[]
	}
	priority: {
		critical: boolean
		important: boolean
	}
}

interface GeneratedSecrets {
	nextAuthSecret: string
	jwtSecret: string
	encryptionKey: string
	sessionSecret: string
}

export default function SecurityDashboard() {
	const [validation, setValidation] = useState<SecurityValidation | null>(null)
	const [recommendations, setRecommendations] =
		useState<SecurityRecommendations | null>(null)
	const [secrets, setSecrets] = useState<GeneratedSecrets | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const fetchSecurityData = async (action: string) => {
		setIsLoading(true)
		try {
			const response = await fetch(`/api/security/validate?action=${action}`)
			const data = await response.json()

			if (data.success) {
				switch (action) {
					case 'validate':
						setValidation(data.validation)
						break
					case 'recommendations':
						setRecommendations(data)
						break
					case 'generate':
						setSecrets(data.secrets)
						break
				}
				toast.success('Security data loaded successfully')
			} else {
				toast.error(data.error || 'Failed to load security data')
			}
		} catch (error) {
			console.error('Security API error:', error)
			toast.error('Failed to connect to security API')
		} finally {
			setIsLoading(false)
		}
	}

	const copyToClipboard = (text: string, label: string) => {
		navigator.clipboard.writeText(text)
		toast.success(`${label} copied to clipboard`)
	}

	const generateNewSecrets = () => {
		fetchSecurityData('generate')
	}

	const validateSecurity = useCallback(() => {
		fetchSecurityData('validate')
	}, [])

	const getRecommendations = () => {
		fetchSecurityData('recommendations')
	}

	useEffect(() => {
		// Auto-validate on component mount
		validateSecurity()
	}, [validateSecurity])

	return (
		<div className="space-y-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold text-gray-900">
						Security Dashboard
					</h1>
					<p className="text-gray-600">
						Monitor and manage application security
					</p>
				</div>
				<div className="flex space-x-2">
					<Button
						onClick={validateSecurity}
						disabled={isLoading}
						variant="outline"
						className="flex items-center gap-2"
					>
						{getFontAwesomeIcon('ShieldCheck', 'w-4 h-4')}
						Validate Security
					</Button>
					<Button
						onClick={generateNewSecrets}
						disabled={isLoading}
						className="flex items-center gap-2"
					>
						{getFontAwesomeIcon('Key', 'w-4 h-4')}
						Generate Secrets
					</Button>
				</div>
			</div>

			{/* Security Status */}
			{validation && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{getFontAwesomeIcon('Shield', 'w-5 h-5')}
							Security Status
						</CardTitle>
						<CardDescription>
							Current security configuration validation
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{/* Status Badge */}
							<div className="flex items-center gap-2">
								<Badge
									variant={validation.isValid ? 'default' : 'destructive'}
									className="text-sm"
								>
									{validation.isValid ? 'Secure' : 'Issues Found'}
								</Badge>
								<span className="text-sm text-gray-600">
									{validation.errors.length} errors,{' '}
									{validation.warnings.length} warnings
								</span>
							</div>

							{/* Errors */}
							{validation.errors.length > 0 && (
								<Alert className="border-red-200 bg-red-50">
									<AlertDescription>
										<div className="space-y-2">
											<h4 className="font-semibold text-red-800">
												Critical Issues:
											</h4>
											<ul className="list-disc list-inside space-y-1">
												{validation.errors.map((error, index) => (
													<li key={index} className="text-red-700">
														{error}
													</li>
												))}
											</ul>
										</div>
									</AlertDescription>
								</Alert>
							)}

							{/* Warnings */}
							{validation.warnings.length > 0 && (
								<Alert className="border-yellow-200 bg-yellow-50">
									<AlertDescription>
										<div className="space-y-2">
											<h4 className="font-semibold text-yellow-800">
												Warnings:
											</h4>
											<ul className="list-disc list-inside space-y-1">
												{validation.warnings.map((warning, index) => (
													<li key={index} className="text-yellow-700">
														{warning}
													</li>
												))}
											</ul>
										</div>
									</AlertDescription>
								</Alert>
							)}

							{/* Success Message */}
							{validation.isValid && validation.warnings.length === 0 && (
								<Alert className="border-green-200 bg-green-50">
									<AlertDescription className="text-green-800">
										✅ All security checks passed! Your application is properly
										configured.
									</AlertDescription>
								</Alert>
							)}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Generated Secrets */}
			{secrets && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{getFontAwesomeIcon('Key', 'w-5 h-5')}
							Generated Secrets
						</CardTitle>
						<CardDescription>
							Cryptographically secure secrets for your application
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<Alert className="border-blue-200 bg-blue-50">
								<AlertDescription className="text-blue-800">
									🔐 These secrets are cryptographically secure. Copy them to
									your environment variables.
								</AlertDescription>
							</Alert>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{Object.entries(secrets).map(([key, value]) => (
									<div key={key} className="space-y-2">
										<label className="text-sm font-medium text-gray-700">
											{key.toUpperCase()}
										</label>
										<div className="flex items-center gap-2">
											<code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
												{value}
											</code>
											<Button
												size="sm"
												variant="outline"
												onClick={() => copyToClipboard(value, key)}
												className="shrink-0"
											>
												{getFontAwesomeIcon('Copy', 'w-4 h-4')}
											</Button>
										</div>
									</div>
								))}
							</div>

							<div className="pt-4 border-t">
								<h4 className="font-semibold text-gray-900 mb-2">
									Instructions:
								</h4>
								<ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
									<li>
										Copy each secret to your corresponding environment variable
									</li>
									<li>Never commit these secrets to version control</li>
									<li>Use different secrets for development and production</li>
									<li>Rotate secrets every 90 days</li>
								</ol>
							</div>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Security Recommendations */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{getFontAwesomeIcon('Lightbulb', 'w-5 h-5')}
						Security Recommendations
					</CardTitle>
					<CardDescription>
						Best practices and security improvements
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						onClick={getRecommendations}
						disabled={isLoading}
						variant="outline"
						className="mb-4"
					>
						{getFontAwesomeIcon('Refresh', 'w-4 h-4 mr-2')}
						Load Recommendations
					</Button>

					{recommendations && (
						<div className="space-y-3">
							{recommendations.recommendations.map((recommendation, index) => (
								<div
									key={index}
									className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
								>
									{getFontAwesomeIcon(
										'CheckCircle',
										'w-5 h-5 text-green-500 mt-0.5',
									)}
									<span className="text-sm text-gray-700">
										{recommendation}
									</span>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{getFontAwesomeIcon('Tools', 'w-5 h-5')}
						Quick Actions
					</CardTitle>
					<CardDescription>Common security tasks and utilities</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						<Button
							onClick={() =>
								window.open('/api/security/validate?action=template', '_blank')
							}
							variant="outline"
							className="flex items-center gap-2"
						>
							{getFontAwesomeIcon('FileText', 'w-4 h-4')}
							Generate Template
						</Button>
						<Button
							onClick={() =>
								window.open('/api/security/validate?action=validate', '_blank')
							}
							variant="outline"
							className="flex items-center gap-2"
						>
							{getFontAwesomeIcon('ExternalLink', 'w-4 h-4')}
							API Validation
						</Button>
						<Button
							onClick={() =>
								window.open('/api/security/validate?action=generate', '_blank')
							}
							variant="outline"
							className="flex items-center gap-2"
						>
							{getFontAwesomeIcon('ExternalLink', 'w-4 h-4')}
							API Generate
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
