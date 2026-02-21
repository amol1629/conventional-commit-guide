'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { validateCommitMessage } from '@/utils/validation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

const COMMIT_TYPES = [
	{ value: 'feat', label: 'feat', description: 'A new feature', emoji: '✨' },
	{ value: 'fix', label: 'fix', description: 'A bug fix', emoji: '🐛' },
	{
		value: 'docs',
		label: 'docs',
		description: 'Documentation only changes',
		emoji: '📚',
	},
	{
		value: 'style',
		label: 'style',
		description: 'Changes that do not affect the meaning of the code',
		emoji: '💄',
	},
	{
		value: 'refactor',
		label: 'refactor',
		description: 'A code change that neither fixes a bug nor adds a feature',
		emoji: '♻️',
	},
	{
		value: 'perf',
		label: 'perf',
		description: 'A code change that improves performance',
		emoji: '⚡',
	},
	{
		value: 'test',
		label: 'test',
		description: 'Adding missing tests or correcting existing tests',
		emoji: '🧪',
	},
	{
		value: 'build',
		label: 'build',
		description:
			'Changes that affect the build system or external dependencies',
		emoji: '🔧',
	},
	{
		value: 'ci',
		label: 'ci',
		description: 'Changes to our CI configuration files and scripts',
		emoji: '👷',
	},
	{
		value: 'chore',
		label: 'chore',
		description: "Other changes that don't modify src or test files",
		emoji: '🔨',
	},
	{
		value: 'revert',
		label: 'revert',
		description: 'Reverts a previous commit',
		emoji: '⏪',
	},
]

export function CommitGenerator() {
	const [type, setType] = useState('')
	const [scope, setScope] = useState('')
	const [description, setDescription] = useState('')
	const [body, setBody] = useState('')
	const [footer, setFooter] = useState('')
	const [isBreaking, setIsBreaking] = useState(false)
	const [copied, setCopied] = useState(false)
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	const generateCommit = useMemo(() => {
		if (!type || !description) {
			return ''
		}

		let commit = type
		if (scope) commit += `(${scope})`
		if (isBreaking) commit += '!'
		commit += `: ${description}`

		if (body) commit += `\n\n${body}`
		if (footer) commit += `\n\n${footer}`
		if (isBreaking) commit += '\n\nBREAKING CHANGE: '

		return commit
	}, [type, scope, description, body, footer, isBreaking])

	const copyToClipboard = async () => {
		if (!generateCommit) {
			toast.error(
				'Missing required fields!\nPlease select a type and enter a description.',
			)
			return
		}

		await navigator.clipboard.writeText(generateCommit)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
		toast.success('Copied to clipboard!\nYour commit message has been copied!')
	}

	const resetForm = () => {
		setType('')
		setScope('')
		setDescription('')
		setBody('')
		setFooter('')
		setIsBreaking(false)
	}

	const selectedType = COMMIT_TYPES.find((t) => t.value === type)

	if (!mounted) {
		return (
			<div className="max-w-4xl mx-auto space-y-6">
				<div className="text-center space-y-2">
					<h1 className="text-4xl font-bold text-foreground">
						Commit Generator
					</h1>
					<p className="text-muted-foreground text-lg">
						Create perfect conventional commit messages with our interactive
						generator
					</p>
				</div>
				<div className="grid lg:grid-cols-2 gap-6">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>⚡</span>
								Commit Details
							</CardTitle>
							<CardDescription>Loading...</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="animate-pulse space-y-4">
								<div className="h-10 bg-muted rounded"></div>
								<div className="h-10 bg-muted rounded"></div>
								<div className="h-10 bg-muted rounded"></div>
								<div className="h-20 bg-muted rounded"></div>
								<div className="h-16 bg-muted rounded"></div>
							</div>
						</CardContent>
					</Card>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<span>👁️</span>
								Preview
							</CardTitle>
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
				<h1 className="text-4xl font-bold text-foreground">Commit Generator</h1>
				<p className="text-muted-foreground text-lg">
					Create perfect conventional commit messages with our interactive
					generator
				</p>
			</div>

			<div className="grid lg:grid-cols-2 gap-6">
				{/* Form */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>⚡</span>
							Commit Details
						</CardTitle>
						<CardDescription>
							Fill in the details to generate your commit message
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{/* Type Selection */}
						<div className="space-y-2">
							<Label htmlFor="type">Type *</Label>
							<Select value={type} onValueChange={setType}>
								<SelectTrigger>
									<SelectValue placeholder="Select commit type" />
								</SelectTrigger>
								<SelectContent>
									{COMMIT_TYPES.map((type) => (
										<SelectItem key={type.value} value={type.value}>
											<div className="flex items-center gap-2">
												<span>{type.emoji}</span>
												<span>{type.label}</span>
												<span className="text-muted-foreground">
													- {type.description}
												</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Scope */}
						<div className="space-y-2">
							<Label htmlFor="scope">Scope (optional)</Label>
							<Input
								id="scope"
								placeholder="e.g., auth, api, ui"
								value={scope}
								onChange={(e) => setScope(e.target.value)}
							/>
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label htmlFor="description">Description *</Label>
							<Input
								id="description"
								placeholder="Brief description of the change"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>

						{/* Breaking Change */}
						<div className="flex items-center space-x-2">
							<input
								type="checkbox"
								id="breaking"
								checked={isBreaking}
								onChange={(e) => setIsBreaking(e.target.checked)}
								className="rounded border-gray-300"
							/>
							<Label htmlFor="breaking">Breaking change</Label>
						</div>

						{/* Body */}
						<div className="space-y-2">
							<Label htmlFor="body">Body (optional)</Label>
							<Textarea
								id="body"
								placeholder="More detailed explanation of the change"
								value={body}
								onChange={(e) => setBody(e.target.value)}
								rows={3}
							/>
						</div>

						{/* Footer */}
						<div className="space-y-2">
							<Label htmlFor="footer">Footer (optional)</Label>
							<Textarea
								id="footer"
								placeholder="References to issues, PRs, etc."
								value={footer}
								onChange={(e) => setFooter(e.target.value)}
								rows={2}
							/>
						</div>

						<div className="flex gap-2">
							<Button onClick={copyToClipboard} className="flex-1">
								{copied
									? getFontAwesomeIcon('Check', 'w-4 h-4 mr-2')
									: getFontAwesomeIcon('Copy', 'w-4 h-4 mr-2')}
								{copied ? 'Copied!' : 'Copy Commit'}
							</Button>
							<Button variant="outline" onClick={resetForm}>
								{getFontAwesomeIcon('RefreshCw', 'w-4 h-4 mr-2')}
								Reset
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Preview */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<span>👁️</span>
							Preview
						</CardTitle>
						<CardDescription>Your generated commit message</CardDescription>
					</CardHeader>
					<CardContent>
						{selectedType && (
							<div className="mb-4 p-3 bg-muted rounded-lg">
								<div className="flex items-center gap-2 mb-2">
									<span className="text-2xl">{selectedType.emoji}</span>
									<span className="font-semibold">{selectedType.label}</span>
									<Badge variant="secondary">{selectedType.description}</Badge>
								</div>
							</div>
						)}

						<div className="bg-muted p-4 rounded-lg font-mono text-sm whitespace-pre-wrap">
							{generateCommit || 'Your commit message will appear here...'}
						</div>

						{generateCommit && (() => {
							const validation = validateCommitMessage(generateCommit)

							if (!validation.isValid) {
								return (
									<div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
										<div className="flex items-start gap-2 text-red-700 dark:text-red-300">
											{getFontAwesomeIcon('XCircle', 'w-4 h-4 mt-0.5 flex-shrink-0')}
											<div className="flex-1">
												<span className="font-medium block mb-1">Invalid commit message!</span>
												<ul className="text-sm space-y-1">
													{validation.errors.map((error, idx) => (
														<li key={idx}>• {error}</li>
													))}
												</ul>
											</div>
										</div>
									</div>
								)
							}

							if (validation.warnings.length > 0) {
								return (
									<div className="mt-4 space-y-2">
										<div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
											<div className="flex items-center gap-2 text-green-700 dark:text-green-300">
												{getFontAwesomeIcon('CheckCircle', 'w-4 h-4')}
												<span className="font-medium">Valid commit message!</span>
											</div>
										</div>
										<div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
											<div className="flex items-start gap-2 text-yellow-700 dark:text-yellow-300">
												{getFontAwesomeIcon('AlertTriangle', 'w-4 h-4 mt-0.5 flex-shrink-0')}
												<div className="flex-1">
													<span className="font-medium block mb-1">Suggestions:</span>
													<ul className="text-sm space-y-1">
														{validation.warnings.map((warning, idx) => (
															<li key={idx}>• {warning}</li>
														))}
													</ul>
												</div>
											</div>
										</div>
									</div>
								)
							}

							return (
								<div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
									<div className="flex items-center gap-2 text-green-700 dark:text-green-300">
										{getFontAwesomeIcon('CheckCircle', 'w-4 h-4')}
										<span className="font-medium">Perfect! Valid commit message!</span>
									</div>
								</div>
							)
						})()}
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
