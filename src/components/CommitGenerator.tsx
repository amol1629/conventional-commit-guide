'use client'

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
import { analyzeWithAI, validateCommitMessage, type AIAnalysis } from '@/utils/validation'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'

const COMMIT_TYPES = [
	{ value: 'feat', label: 'feat', description: 'A new feature', emoji: '✨' },
	{ value: 'fix', label: 'fix', description: 'A bug fix', emoji: '🐛' },
	{ value: 'docs', label: 'docs', description: 'Documentation only changes', emoji: '📚' },
	{ value: 'style', label: 'style', description: 'Changes that do not affect the meaning of the code', emoji: '💄' },
	{ value: 'refactor', label: 'refactor', description: 'A code change that neither fixes a bug nor adds a feature', emoji: '♻️' },
	{ value: 'perf', label: 'perf', description: 'A code change that improves performance', emoji: '⚡' },
	{ value: 'test', label: 'test', description: 'Adding missing tests or correcting existing tests', emoji: '🧪' },
	{ value: 'build', label: 'build', description: 'Changes that affect the build system or external dependencies', emoji: '🔧' },
	{ value: 'ci', label: 'ci', description: 'Changes to our CI configuration files and scripts', emoji: '👷' },
	{ value: 'chore', label: 'chore', description: "Other changes that don't modify src or test files", emoji: '🔨' },
	{ value: 'revert', label: 'revert', description: 'Reverts a previous commit', emoji: '⏪' },
]

function ScoreBadge({ score }: { score: number }) {
	const color =
		score >= 90 ? 'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700' :
			score >= 70 ? 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700' :
				score >= 40 ? 'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700' :
					'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700'

	const label =
		score >= 90 ? 'Excellent' :
			score >= 70 ? 'Good' :
				score >= 40 ? 'Needs work' :
					'Poor'

	return (
		<span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] sm:text-[11.5px] font-semibold border ${color}`}>
			<span className="tabular-nums">{score}/100</span>
			<span className="opacity-60">·</span>
			<span>{label}</span>
		</span>
	)
}

export function CommitGenerator() {
	const [type, setType] = useState('')
	const [scope, setScope] = useState('')
	const [description, setDescription] = useState('')
	const [body, setBody] = useState('')
	const [footer, setFooter] = useState('')
	const [isBreaking, setIsBreaking] = useState(false)
	const [copied, setCopied] = useState(false)
	const [mounted, setMounted] = useState(false)
	const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis>({
		loading: false, issues: [], corrected: null, alternatives: null, isPerfect: false, scopeSuggestion: null, bodyHint: null, footerHint: null, error: null,
	})

	useEffect(() => { setMounted(true) }, [])

	const generateCommit = useMemo(() => {
		if (!type || !description) return ''
		let commit = type
		if (scope) commit += `(${scope})`
		if (isBreaking) commit += '!'
		commit += `: ${description}`
		if (body) commit += `\n\n${body}`
		if (footer) commit += `\n\n${footer}`
		if (isBreaking) commit += '\n\nBREAKING CHANGE: '
		return commit
	}, [type, scope, description, body, footer, isBreaking])

	// AI analysis — debounced 800ms after user stops typing
	useEffect(() => {
		if (!generateCommit) {
			setAiAnalysis({ loading: false, issues: [], corrected: null, alternatives: null, isPerfect: false, scopeSuggestion: null, bodyHint: null, footerHint: null, error: null })
			return
		}
		setAiAnalysis(prev => ({ ...prev, loading: true }))
		const timer = setTimeout(async () => {
			const result = await analyzeWithAI(generateCommit, { type, scope, description, isBreaking })
			setAiAnalysis(result)
		}, 800)
		return () => clearTimeout(timer)
	}, [generateCommit])

	const copyToClipboard = async () => {
		if (!generateCommit) {
			toast.error('Missing required fields!\nPlease select a type and enter a description.')
			return
		}
		await navigator.clipboard.writeText(generateCommit)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
		toast.success('Copied to clipboard!\nYour commit message has been copied!')
	}

	const resetForm = () => {
		setType(''); setScope(''); setDescription('')
		setBody(''); setFooter(''); setIsBreaking(false)
		setAiAnalysis({ loading: false, issues: [], corrected: null, alternatives: null, isPerfect: false, scopeSuggestion: null, bodyHint: null, footerHint: null, error: null })
	}

	const selectedType = COMMIT_TYPES.find((t) => t.value === type)
	const validation = generateCommit ? validateCommitMessage(generateCommit) : null

	if (!mounted) {
		return (
			<div className="max-w-6xl mx-auto space-y-8">
				<div className="grid lg:grid-cols-2 gap-6">
					{[
						{ icon: 'CodeCommit', titleColor: 'text-cyan-600', title: 'Commit Details' },
						{ icon: 'Eye', titleColor: 'text-green-600', title: 'Preview' },
					].map(({ icon, titleColor, title }) => (
						<Card key={title}>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									{getFontAwesomeIcon(icon, 'w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0')}
									<span className={`${titleColor} text-[18px] sm:text-[19px] lg:text-[20px] font-semibold tracking-tight`}>{title}</span>
								</CardTitle>
								<CardDescription className="text-[13px] sm:text-[13.5px] lg:text-[14px]">Loading…</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="animate-pulse space-y-4">
									{[10, 10, 10, 20, 16].map((h, i) => (
										<div key={i} style={{ height: `${h * 4}px` }} className="bg-muted rounded" />
									))}
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="max-w-6xl mx-auto space-y-8">
			<div className="grid lg:grid-cols-2 gap-6">

				{/* ── Form Card ────────────────────────────────────── */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{getFontAwesomeIcon('CodeCommit', 'w-7 h-7 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0')}
							<span className="text-cyan-600 text-[18px] sm:text-[19px] lg:text-[20px] font-semibold tracking-tight">
								Commit Details
							</span>
						</CardTitle>
						<CardDescription className="text-[13px] sm:text-[13.5px] lg:text-[14px] leading-relaxed">
							Fill in the details to generate your commit message
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-5">

						{/* Type */}
						<div className="space-y-1.5">
							<Label htmlFor="type" className="text-[13px] sm:text-[13.5px] lg:text-[14px] font-medium">
								Type <span className="text-red-500">*</span>
							</Label>
							<Select value={type} onValueChange={setType}>
								<SelectTrigger className="min-h-[52px] sm:min-h-[44px] gap-4 text-[15px] sm:text-[14px]">
									<SelectValue placeholder="Select commit type" />
								</SelectTrigger>
								<SelectContent>
									{COMMIT_TYPES.map((t) => (
										<SelectItem
											key={t.value}
											value={t.value}
											className="lg:rounded-full cursor-pointer my-0.5 py-2.5 sm:py-2 items-start"
										>
											<div className="flex items-start gap-2">
												<span className="text-[15px] sm:text-[14px]">{t.emoji}</span>
												<span className="text-[14px] sm:text-[13px] lg:text-[13.5px] font-medium">{t.label}</span>
												<span className="text-[13px] sm:text-[12px] lg:text-[12.5px] text-muted-foreground">— {t.description}</span>
											</div>
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* Scope */}
						<div className="space-y-1.5">
							<Label htmlFor="scope" className="text-[13px] sm:text-[13.5px] lg:text-[14px] font-medium">
								Scope <span className="text-muted-foreground font-normal">(optional)</span>
							</Label>
							<Input
								id="scope"
								placeholder="e.g., auth, api, ui"
								value={scope}
								onChange={(e) => setScope(e.target.value)}
								className="text-[16px] sm:text-[14px] h-11 sm:h-10"
							/>
						</div>

						{/* Description */}
						<div className="space-y-1.5">
							<div className="flex items-center justify-between">
								<Label htmlFor="description" className="text-[13px] sm:text-[13.5px] lg:text-[14px] font-medium">
									Description <span className="text-red-500">*</span>
								</Label>
								{/* Live char counter */}
								{description.length > 0 && (() => {
									// Subject = type + (scope) + ! + ": " + description
									const subjectLen = type.length
										+ (scope ? scope.length + 2 : 0)
										+ (isBreaking ? 1 : 0)
										+ 2 // ": "
										+ description.length

									const color =
										subjectLen > 72 ? 'text-red-500 font-semibold' :
											subjectLen > 50 ? 'text-yellow-600 font-semibold' :
												'text-green-600'
									return (
										<span className={`text-[11.5px] tabular-nums transition-colors duration-150 ${color}`}>
											{subjectLen}/72
										</span>
									)
								})()}
							</div>
							<Input
								id="description"
								placeholder="e.g., add OAuth2 login with Google provider"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								className={[
									'text-[16px] sm:text-[14px] h-11 sm:h-10 transition-colors duration-150',
									(() => {
										const subjectLen = type.length
											+ (scope ? scope.length + 2 : 0)
											+ (isBreaking ? 1 : 0) + 2
											+ description.length
										return subjectLen > 72
											? 'border-red-400 focus:border-red-500'
											: subjectLen > 50
												? 'border-yellow-400 focus:border-yellow-500'
												: ''
									})(),
								].join(' ')}
							/>
							{/* Overflow hint */}
							{(() => {
								const subjectLen = type.length
									+ (scope ? scope.length + 2 : 0)
									+ (isBreaking ? 1 : 0) + 2
									+ description.length
								if (subjectLen > 72) return (
									<p className="text-[11.5px] text-red-500 leading-snug">
										Subject is {subjectLen} chars — {subjectLen - 72} over the 72-char limit. Move detail to the body.
									</p>
								)
								if (subjectLen > 50) return (
									<p className="text-[11.5px] text-yellow-600 leading-snug">
										Subject is {subjectLen} chars — {subjectLen - 50} over the ideal 50. Acceptable but trimming helps.
									</p>
								)
								return null
							})()}
						</div>

						{/* Breaking */}
						<div className="flex items-center space-x-2.5">
							<input
								type="checkbox"
								id="breaking"
								checked={isBreaking}
								onChange={(e) => setIsBreaking(e.target.checked)}
								className="w-4 h-4 rounded border-gray-300 focus-visible:outline-none"
							/>
							<Label
								htmlFor="breaking"
								className="text-[13px] sm:text-[13.5px] lg:text-[14px] font-medium cursor-pointer"
							>
								Breaking change
							</Label>
						</div>

						{/* Body */}
						<div className="space-y-1.5">
							<Label htmlFor="body" className="text-[13px] sm:text-[13.5px] lg:text-[14px] font-medium">
								Body <span className="text-muted-foreground font-normal">(optional)</span>
							</Label>
							<Textarea
								id="body"
								placeholder={`Explain the "why" behind this change, not the "what".\n\ne.g., The previous approach caused session conflicts\nwhen multiple tabs were open simultaneously.`}
								value={body}
								onChange={(e) => setBody(e.target.value)}
								rows={3}
								className="text-[16px] sm:text-[14px] leading-relaxed resize-none"
							/>
						</div>

						{/* Footer */}
						<div className="space-y-1.5">
							<Label htmlFor="footer" className="text-[13px] sm:text-[13.5px] lg:text-[14px] font-medium">
								Footer <span className="text-muted-foreground font-normal">(optional)</span>
							</Label>
							<Textarea
								id="footer"
								placeholder="e.g., Closes #123, Fixes #456, BREAKING CHANGE: …"
								value={footer}
								onChange={(e) => setFooter(e.target.value)}
								rows={2}
								className="text-[16px] sm:text-[14px] leading-relaxed resize-none"
							/>
						</div>

						{/* Buttons */}
						<div className="flex gap-2 pt-1">
							<Button
								onClick={copyToClipboard}
								variant="outline"
								className="flex-1 h-11 sm:h-10 text-[14px] sm:text-[13.5px] font-semibold text-teal-700 bg-teal-50 border-2 border-teal-300 hover:bg-teal-100 hover:border-teal-400 hover:text-teal-800 dark:text-teal-100 dark:bg-teal-900/30 dark:border-teal-400 dark:hover:bg-teal-900/40 focus:outline-none shadow-sm hover:shadow-md transition-all duration-200 rounded-lg touch-manipulation"
							>
								{copied ? getFontAwesomeIcon('Check', 'w-4 h-4 mr-1.5') : getFontAwesomeIcon('Copy', 'w-4 h-4 mr-1.5')}
								{copied ? 'Copied!' : 'Copy Commit'}
							</Button>
							<Button
								variant="outline"
								onClick={resetForm}
								className="flex-1 h-11 sm:h-10 text-[14px] sm:text-[13.5px] font-semibold text-orange-700 border-2 border-orange-300 rounded-lg bg-orange-50 hover:bg-orange-100 focus:outline-none hover:border-orange-400 hover:text-orange-800 dark:text-white dark:bg-orange-50 dark:border-orange-400 shadow-sm hover:shadow-md transition-all duration-200 touch-manipulation"
							>
								{getFontAwesomeIcon('RefreshCw', 'w-4 h-4 mr-1.5')}
								Reset
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* ── Preview Card ──────────────────────────────────── */}
				<Card>
					<CardHeader>
						<div className="flex items-start justify-between gap-2">
							<div>
								<CardTitle className="flex items-center gap-2">
									{getFontAwesomeIcon('Eye', 'w-6 h-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0')}
									<span className="text-green-600 text-[18px] sm:text-[19px] lg:text-[20px] font-semibold tracking-tight">
										Preview
									</span>
								</CardTitle>
								<CardDescription className="text-[13px] sm:text-[13.5px] lg:text-[14px] leading-relaxed mt-1">
									Your generated commit message
								</CardDescription>
							</div>
							{validation && (
								<div className="mt-0.5 shrink-0">
									<ScoreBadge score={validation.score} />
								</div>
							)}
						</div>
					</CardHeader>

					<CardContent className="space-y-4">

						{/* Raw commit preview */}
						<div className={[
							'px-4 py-3 rounded-lg font-mono whitespace-pre-wrap text-[13px] sm:text-[12.5px] lg:text-[13px] leading-relaxed border transition-all duration-300',
							// No commit yet → neutral
							!validation
								? 'bg-[#f7faff] border-[#b3ccff]'
								// Rule errors → red (immediate, no AI needed)
								: !validation.isValid
									? 'bg-red-50 border-red-300 dark:bg-red-950/20 dark:border-red-700'
									// AI still loading → hold at neutral to avoid flicker
									: aiAnalysis.loading
										? 'bg-[#f7faff] border-[#b3ccff]'
										// AI found errors → red
										: aiAnalysis.issues.some(i => i.severity === 'error')
											? 'bg-red-50 border-red-300 dark:bg-red-950/20 dark:border-red-700'
											// Rule warnings or AI warnings → yellow
											: (validation.warnings.length > 0 || aiAnalysis.issues.some(i => i.severity === 'warning'))
												? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-950/20 dark:border-yellow-700'
												// Rules pass + AI says perfect → bright green
												: aiAnalysis.isPerfect
													? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-700'
													// Rules pass + AI has only info or no issues → softer green
													: 'bg-green-50 border-green-300 dark:bg-green-950/20 dark:border-green-700',
						].join(' ')}>
							{generateCommit || (
								<span className="text-muted-foreground">Your commit message will appear here…</span>
							)}
						</div>

						{/* ── Validation Results ── */}
						{validation && (
							<div className="space-y-3">

								{/* Suggestions */}
								{validation.suggestions.length > 0 && (
									<div className="rounded-lg border border-violet-200 dark:border-violet-800 overflow-hidden">
										<div className="flex items-center gap-2 px-3 py-2 bg-violet-50 dark:bg-violet-900/30 border-b border-violet-200 dark:border-violet-800">
											{getFontAwesomeIcon('Lightbulb', 'w-3.5 h-3.5 text-violet-600 dark:text-violet-400 shrink-0')}
											<span className="text-[12.5px] sm:text-[12px] font-semibold text-violet-700 dark:text-violet-300">
												{validation.suggestions.length} Suggestion{validation.suggestions.length > 1 ? 's' : ''}
											</span>
										</div>
										<ul className="divide-y divide-violet-100 dark:divide-violet-900/30">
											{validation.suggestions.map((s, i) => (
												<li key={i} className="flex items-start gap-2 px-3 py-2.5 bg-white dark:bg-violet-950/20">
													<span className="mt-[3px] text-violet-400 shrink-0 leading-none text-[10px]">✦</span>
													<span className="text-[12.5px] sm:text-[12px] text-violet-700 dark:text-violet-300 leading-snug font-mono">{s}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Errors */}
								{validation.errors.length > 0 && (
									<div className="rounded-lg border border-red-200 dark:border-red-800 overflow-hidden">
										<div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800">
											{getFontAwesomeIcon('XCircle', 'w-3.5 h-3.5 text-red-600 dark:text-red-400 shrink-0')}
											<span className="text-[12.5px] sm:text-[12px] font-semibold text-red-700 dark:text-red-300">
												{validation.errors.length} Error{validation.errors.length > 1 ? 's' : ''} · Must fix
											</span>
										</div>
										<ul className="divide-y divide-red-100 dark:divide-red-900/30">
											{validation.errors.map((err, i) => (
												<li key={i} className="flex items-start gap-2 px-3 py-2.5 bg-white dark:bg-red-950/20">
													<span className="mt-[3px] text-red-400 shrink-0 leading-none text-[10px]">✕</span>
													<span className="text-[12.5px] sm:text-[12px] text-red-700 dark:text-red-300 leading-snug">{err}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Warnings */}
								{validation.warnings.length > 0 && (
									<div className="rounded-lg border border-yellow-200 dark:border-yellow-800 overflow-hidden">
										<div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/30 border-b border-yellow-200 dark:border-yellow-800">
											{getFontAwesomeIcon('AlertTriangle', 'w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 shrink-0')}
											<span className="text-[12.5px] sm:text-[12px] font-semibold text-yellow-700 dark:text-yellow-300">
												{validation.warnings.length} Warning{validation.warnings.length > 1 ? 's' : ''} · Should fix
											</span>
										</div>
										<ul className="divide-y divide-yellow-100 dark:divide-yellow-900/30">
											{validation.warnings.map((w, i) => (
												<li key={i} className="flex items-start gap-2 px-3 py-2.5 bg-white dark:bg-yellow-950/20">
													<span className="mt-[3px] text-yellow-500 shrink-0 leading-none text-[10px]">⚠</span>
													<span className="text-[12.5px] sm:text-[12px] text-yellow-700 dark:text-yellow-300 leading-snug">{w}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* Tips */}
								{validation.infos.length > 0 && (
									<div className="rounded-lg border border-blue-200 dark:border-blue-800 overflow-hidden">
										<div className="flex items-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800">
											{getFontAwesomeIcon('Info', 'w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0')}
											<span className="text-[12.5px] sm:text-[12px] font-semibold text-blue-700 dark:text-blue-300">
												{validation.infos.length} Tip{validation.infos.length > 1 ? 's' : ''}
											</span>
										</div>
										<ul className="divide-y divide-blue-100 dark:divide-blue-900/30">
											{validation.infos.map((info, i) => (
												<li key={i} className="flex items-start gap-2 px-3 py-2.5 bg-white dark:bg-blue-950/20">
													<span className="mt-[3px] text-blue-400 shrink-0 leading-none text-[10px]">ℹ</span>
													<span className="text-[12.5px] sm:text-[12px] text-blue-700 dark:text-blue-300 leading-snug">{info}</span>
												</li>
											))}
										</ul>
									</div>
								)}

								{/* ── AI Semantic Analysis ── */}
								<div className="rounded-lg border border-indigo-200 dark:border-indigo-800 overflow-hidden">
									<div className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-indigo-900/30 border-b border-indigo-200 dark:border-indigo-800">
										{getFontAwesomeIcon('Sparkles', 'w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0')}
										<span className="text-[12.5px] sm:text-[12px] font-semibold text-indigo-700 dark:text-indigo-300">
											AI Semantic Analysis
										</span>
										{aiAnalysis.loading && (
											<span className="ml-auto flex items-center gap-1.5 text-[11px] text-indigo-500 dark:text-indigo-400">
												<span className="w-2.5 h-2.5 rounded-full border-2 border-indigo-400 border-t-transparent animate-spin" />
												Analyzing…
											</span>
										)}
										{!aiAnalysis.loading && aiAnalysis.isPerfect && (
											<span className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
												{getFontAwesomeIcon('CheckCircle', 'w-3 h-3 shrink-0')}
												Perfect!
											</span>
										)}
									</div>

									<div className="bg-white dark:bg-indigo-950/20 px-3 py-2.5 space-y-2.5">

										{/* Loading dots */}
										{aiAnalysis.loading && (
											<div className="flex gap-1.5 items-center">
												{[0, 1, 2].map(i => (
													<span
														key={i}
														className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
														style={{ animationDelay: `${i * 150}ms` }}
													/>
												))}
												<span className="text-[12px] text-indigo-400 ml-1">Checking semantics…</span>
											</div>
										)}

										{/* Error fallback */}
										{!aiAnalysis.loading && aiAnalysis.error && (
											<div className="space-y-1">
												<p className="text-[12px] text-muted-foreground">
													AI analysis unavailable — rule-based validation is still active.
												</p>
												<p className="text-[11px] text-red-400 font-mono break-all">
													{aiAnalysis.error}
												</p>
											</div>
										)}

										{/* ── PERFECT MODE: commit matches AI suggestion ── */}
										{!aiAnalysis.loading && !aiAnalysis.error && aiAnalysis.isPerfect && (
											<div className="space-y-2.5">
												{/* Congrats message */}
												<div className="flex items-start gap-2 px-2.5 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-md">
													{getFontAwesomeIcon('CheckCircle', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-[1px]')}
													<p className="text-[12px] text-emerald-700 dark:text-emerald-300 leading-snug">
														<span className="font-semibold">Great commit message!</span> It is clear, specific, uses the right type and imperative mood.
													</p>
												</div>

												{/* Alternatives */}
												{aiAnalysis.alternatives && aiAnalysis.alternatives.length > 0 && (
													<div>
														<p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold mb-1.5 flex items-center gap-1.5">
															{getFontAwesomeIcon('Lightbulb', 'w-3 h-3 shrink-0')}
															Other valid variations:
														</p>
														<ul className="space-y-1.5">
															{aiAnalysis.alternatives.map((alt, i) => (
																<li key={i} className="flex items-start gap-2">
																	<span className="mt-[3px] text-indigo-300 dark:text-indigo-600 shrink-0 text-[10px]">✦</span>
																	<code className="text-[12px] sm:text-[11.5px] text-indigo-600 dark:text-indigo-300 font-mono leading-snug">{alt}</code>
																</li>
															))}
														</ul>
													</div>
												)}
											</div>
										)}

										{/* ── ISSUES MODE: has problems ── */}
										{!aiAnalysis.loading && !aiAnalysis.error && !aiAnalysis.isPerfect && aiAnalysis.issues.length > 0 && (
											<ul className="space-y-2">
												{aiAnalysis.issues.map((issue, i) => {
													const color =
														issue.severity === 'error' ? 'text-red-700 dark:text-red-300' :
															issue.severity === 'warning' ? 'text-yellow-700 dark:text-yellow-300' :
																'text-blue-700 dark:text-blue-300'
													const iconName =
														issue.severity === 'error' ? 'XCircle' :
															issue.severity === 'warning' ? 'AlertTriangle' : 'Info'
													const iconCls =
														issue.severity === 'error' ? 'w-3.5 h-3.5 text-red-500 dark:text-red-400 shrink-0 mt-[1px]' :
															issue.severity === 'warning' ? 'w-3.5 h-3.5 text-yellow-500 dark:text-yellow-400 shrink-0 mt-[1px]' :
																'w-3.5 h-3.5 text-blue-500 dark:text-blue-400 shrink-0 mt-[1px]'
													return (
														<li key={i} className="flex items-start gap-2">
															{getFontAwesomeIcon(iconName, iconCls)}
															<span className={`text-[12.5px] sm:text-[12px] leading-snug ${color}`}>{issue.message}</span>
														</li>
													)
												})}
											</ul>
										)}

										{/* Scope suggestion */}
										{!aiAnalysis.loading && !aiAnalysis.isPerfect && aiAnalysis.scopeSuggestion && !scope && (
											<div className="flex items-center gap-2 px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 rounded-md border border-indigo-100 dark:border-indigo-800">
												<span className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold shrink-0">Scope suggestion:</span>
												<code className="text-[12px] text-indigo-700 dark:text-indigo-300 font-mono">{aiAnalysis.scopeSuggestion}</code>
											</div>
										)}

										{/* Body hint */}
										{!aiAnalysis.loading && aiAnalysis.bodyHint && (
											<div className="flex items-start gap-2 px-2.5 py-2 bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-md">
												{getFontAwesomeIcon('AlignLeft', 'w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0 mt-[1px]')}
												<div>
													<p className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mb-0.5">Body suggestion</p>
													<p className="text-[12px] text-teal-700 dark:text-teal-300 leading-snug">{aiAnalysis.bodyHint}</p>
												</div>
											</div>
										)}

										{/* Footer hint */}
										{!aiAnalysis.loading && aiAnalysis.footerHint && (
											<div className="flex items-start gap-2 px-2.5 py-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-md">
												{getFontAwesomeIcon('Tag', 'w-3.5 h-3.5 text-purple-600 dark:text-purple-400 shrink-0 mt-[1px]')}
												<div>
													<p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mb-0.5">Footer suggestion</p>
													<p className="text-[12px] text-purple-700 dark:text-purple-300 leading-snug">{aiAnalysis.footerHint}</p>
												</div>
											</div>
										)}

										{/* Best version */}
										{!aiAnalysis.loading && !aiAnalysis.isPerfect && aiAnalysis.corrected && (
											<div className="pt-2 border-t border-indigo-100 dark:border-indigo-800">
												<p className="text-[11px] text-indigo-500 dark:text-indigo-400 font-semibold mb-1.5 flex items-center gap-1.5">
													{getFontAwesomeIcon('Star', 'w-3 h-3 text-indigo-500 dark:text-indigo-400 shrink-0')}
													Best version:
												</p>
												<code className="text-[12px] sm:text-[11.5px] text-indigo-700 dark:text-indigo-300 font-mono bg-indigo-50 dark:bg-indigo-900/40 px-2.5 py-2 rounded-md block whitespace-pre-wrap leading-relaxed">
													{aiAnalysis.corrected}
												</code>
											</div>
										)}
									</div>
								</div>

								{/* Perfect state — only when both layers pass */}
								{validation.isValid
									&& validation.warnings.length === 0
									&& validation.infos.length === 0
									&& !aiAnalysis.loading
									&& aiAnalysis.issues.length === 0 && (
										<div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
											{getFontAwesomeIcon('CheckCircle', 'w-4 h-4 text-green-600 dark:text-green-400 shrink-0')}
											<span className="text-[13px] sm:text-[12.5px] font-semibold text-green-700 dark:text-green-300">
												Perfect commit message!
											</span>
										</div>
									)}

								{/* Reference links */}
								<div className="text-[11.5px] sm:text-[11px] text-muted-foreground leading-relaxed space-x-1">
									<span>Follows</span>
									<a
										href="https://www.conventionalcommits.org/en/v1.0.0/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
									>
										Conventional Commits v1.0.0
									</a>
									<span>·</span>
									<a
										href="https://cbea.ms/git-commit/"
										target="_blank"
										rel="noopener noreferrer"
										className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
									>
										How to write a git commit message ↗
									</a>
									<span>·</span>
									<a
										href="https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit"
										target="_blank"
										rel="noopener noreferrer"
										className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
									>
										Angular convention ↗
									</a>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

			</div>
		</div>
	)
}
