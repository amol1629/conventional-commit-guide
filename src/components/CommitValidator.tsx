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
import { Textarea } from '@/components/ui/textarea'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useEffect, useState } from 'react'

interface ValidationResult {
	isValid: boolean
	errors: string[]
	warnings: string[]
	suggestions: string[]
	parsed: {
		type?: string
		scope?: string
		description?: string
		breaking?: boolean
	}
}

const COMMIT_TYPES = [
	'feat',
	'fix',
	'docs',
	'style',
	'refactor',
	'perf',
	'test',
	'build',
	'ci',
	'chore',
	'revert',
]

export function CommitValidator() {
	const [commitMessage, setCommitMessage] = useState('')
	const [validationResult, setValidationResult] =
		useState<ValidationResult | null>(null)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const validateCommit = (message: string): ValidationResult => {
		const errors: string[] = []
		const warnings: string[] = []
		const suggestions: string[] = []
		let isValid = true

		// Basic structure validation
		const lines = message.trim().split('\n')
		const subject = lines[0]

		if (!subject) {
			errors.push('Commit message cannot be empty')
			return { isValid: false, errors, warnings, suggestions, parsed: {} }
		}

		// Parse the subject line
		const match = subject.match(/^(\w+)(?:\(([^)]+)\))?(!)?:\s*(.+)$/)

		if (!match) {
			errors.push(
				'Invalid commit message format. Expected: type(scope): description',
			)
			return { isValid: false, errors, warnings, suggestions, parsed: {} }
		}

		const [, type, scope, breaking, description] = match
		const parsed = { type, scope, description, breaking: !!breaking }

		// Validate type
		if (!COMMIT_TYPES.includes(type)) {
			errors.push(
				`Invalid type "${type}". Must be one of: ${COMMIT_TYPES.join(', ')}`,
			)
			isValid = false
		}

		// Validate description
		if (!description || description.trim().length === 0) {
			errors.push('Description is required')
			isValid = false
		} else if (description.length > 50) {
			warnings.push('Description is longer than 50 characters (recommended)')
		}

		// Check for common issues
		if (description && description[0] !== description[0].toUpperCase()) {
			suggestions.push(
				'Consider capitalizing the first letter of the description',
			)
		}

		if (description && description.endsWith('.')) {
			suggestions.push(
				'Consider removing the period at the end of the description',
			)
		}

		// Check for imperative mood
		const imperativeWords = [
			'add',
			'fix',
			'update',
			'remove',
			'create',
			'delete',
			'change',
			'improve',
		]
		const firstWord = description.split(' ')[0].toLowerCase()
		if (!imperativeWords.includes(firstWord)) {
			suggestions.push(
				'Consider using imperative mood (e.g., "add" instead of "added")',
			)
		}

		// Validate body
		if (lines.length > 1) {
			const body = lines.slice(1).join('\n').trim()
			if (body && body.length > 72) {
				warnings.push('Body lines should be wrapped at 72 characters')
			}
		}

		// Check for breaking changes
		if (breaking && !message.toLowerCase().includes('breaking change')) {
			suggestions.push(
				'Consider adding "BREAKING CHANGE:" in the body for breaking changes',
			)
		}

		return { isValid, errors, warnings, suggestions, parsed }
	}

	const handleValidate = () => {
		if (!commitMessage.trim()) {
			setValidationResult(null)
			return
		}
		const result = validateCommit(commitMessage)
		setValidationResult(result)
	}

	const getStatusIcon = () => {
		if (!validationResult) return null
		if (validationResult.isValid && validationResult.warnings.length === 0) {
			return getFontAwesomeIcon('CheckCircle', 'w-5 h-5 text-green-500')
		}
		if (validationResult.isValid) {
			return getFontAwesomeIcon('AlertTriangle', 'w-5 h-5 text-yellow-500')
		}
		return getFontAwesomeIcon('XCircle', 'w-5 h-5 text-red-500')
	}

	const getStatusText = () => {
		if (!validationResult) return ''
		if (validationResult.isValid && validationResult.warnings.length === 0) {
			return 'Perfect! Your commit message follows conventional commit standards.'
		}
		if (validationResult.isValid) {
			return 'Valid commit message with some suggestions for improvement.'
		}
		return 'Your commit message has some issues that need to be fixed.'
	}

	if (!mounted) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold text-foreground">
						Commit Validator
					</h1>
					<p className="text-muted-foreground text-lg">
						Validate your commit messages against conventional commit standards
					</p>
				</div>
				<div className="grid lg:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Enter Commit Message</CardTitle>
							<CardDescription>Loading...</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="animate-pulse bg-muted p-4 rounded-lg h-32"></div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle>Validation Results</CardTitle>
							<CardDescription>Loading...</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="animate-pulse bg-muted p-4 rounded-lg h-32"></div>
						</CardContent>
					</Card>
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-4xl mx-auto space-y-6">
			<div className="text-center space-y-2">
				<h1 className="text-4xl font-bold text-foreground">Commit Validator</h1>
				<p className="text-muted-foreground text-lg">
					Validate your commit messages against conventional commit standards
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Input */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>📝</span>
							Commit Message
						</CardTitle>
						<CardDescription>
							Paste or type your commit message to validate it
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<Textarea
							placeholder="feat(auth): add OAuth2 login support

- Implement OAuth2 flow
- Add user authentication
- Update user model

Closes #123"
							value={commitMessage}
							onChange={(e) => setCommitMessage(e.target.value)}
							rows={8}
							className="font-mono text-sm"
						/>
						<Button onClick={handleValidate} className="w-full">
							Validate Commit Message
						</Button>
					</CardContent>
				</Card>

				{/* Results */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{getStatusIcon()}
							Validation Results
						</CardTitle>
						<CardDescription>{getStatusText()}</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{validationResult && (
							<>
								{/* Parsed Information */}
								{validationResult.parsed.type && (
									<div className="p-3 bg-muted rounded-lg">
										<h4 className="font-semibold mb-2">Parsed Information:</h4>
										<div className="space-y-1 text-sm">
											<div className="flex gap-2">
												<span className="font-medium">Type:</span>
												<Badge variant="secondary">
													{validationResult.parsed.type}
												</Badge>
											</div>
											{validationResult.parsed.scope && (
												<div className="flex gap-2">
													<span className="font-medium">Scope:</span>
													<Badge variant="outline">
														{validationResult.parsed.scope}
													</Badge>
												</div>
											)}
											{validationResult.parsed.breaking && (
												<div className="flex gap-2">
													<span className="font-medium">Breaking:</span>
													<Badge variant="destructive">Yes</Badge>
												</div>
											)}
										</div>
									</div>
								)}

								{/* Errors */}
								{validationResult.errors.length > 0 && (
									<Alert variant="destructive">
										{getFontAwesomeIcon('XCircle', 'h-4 w-4')}
										<AlertDescription>
											<div className="space-y-1">
												<div className="font-semibold">Errors:</div>
												<ul className="list-disc list-inside space-y-1">
													{validationResult.errors.map((error, index) => (
														<li key={index}>{error}</li>
													))}
												</ul>
											</div>
										</AlertDescription>
									</Alert>
								)}

								{/* Warnings */}
								{validationResult.warnings.length > 0 && (
									<Alert>
										{getFontAwesomeIcon('AlertTriangle', 'h-4 w-4')}
										<AlertDescription>
											<div className="space-y-1">
												<div className="font-semibold">Warnings:</div>
												<ul className="list-disc list-inside space-y-1">
													{validationResult.warnings.map((warning, index) => (
														<li key={index}>{warning}</li>
													))}
												</ul>
											</div>
										</AlertDescription>
									</Alert>
								)}

								{/* Suggestions */}
								{validationResult.suggestions.length > 0 && (
									<Alert>
										{getFontAwesomeIcon('Info', 'h-4 w-4')}
										<AlertDescription>
											<div className="space-y-1">
												<div className="font-semibold">Suggestions:</div>
												<ul className="list-disc list-inside space-y-1">
													{validationResult.suggestions.map(
														(suggestion, index) => (
															<li key={index}>{suggestion}</li>
														),
													)}
												</ul>
											</div>
										</AlertDescription>
									</Alert>
								)}

								{/* Success */}
								{validationResult.isValid &&
									validationResult.warnings.length === 0 &&
									validationResult.suggestions.length === 0 && (
										<Alert>
											{getFontAwesomeIcon('CheckCircle', 'h-4 w-4')}
											<AlertDescription>
												<div className="font-semibold text-green-700 dark:text-green-300">
													🎉 Perfect! Your commit message follows all
													conventional commit standards.
												</div>
											</AlertDescription>
										</Alert>
									)}
							</>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
