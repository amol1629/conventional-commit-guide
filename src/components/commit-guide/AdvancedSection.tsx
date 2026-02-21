'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { COMMIT_GUIDE_CONTENT } from '@/content/commit-guide-content'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

export function AdvancedSection() {
	const { advanced } = COMMIT_GUIDE_CONTENT

	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('AlertTriangle', 'w-6 h-6 text-orange-500')}
						{advanced.breakingChanges.title}
					</CardTitle>
					<CardDescription className="text-base">
						{advanced.breakingChanges.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="p-4 border border-orange-200 rounded-lg bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
						<h4 className="mb-2 font-semibold text-orange-700 dark:text-orange-300">
							{advanced.breakingChanges.whatAre}
						</h4>
						<p className="text-sm text-orange-600 dark:text-orange-400">
							{advanced.breakingChanges.whatAre}
						</p>
					</div>

					<div className="space-y-3">
						<h4 className="font-semibold">How to Mark Breaking Changes:</h4>
						<div className="grid gap-3">
							{advanced.breakingChanges.howToMark.map((example, index) => (
								<div key={index} className="p-3 border rounded-lg bg-muted">
									<code className="font-mono text-sm">{example.message}</code>
									<p className="mt-1 text-xs text-muted-foreground">
										{example.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('Target', 'w-6 h-6 text-blue-500')}
						{advanced.scopes.title}
					</CardTitle>
					<CardDescription className="text-base">
						{advanced.scopes.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<h4 className="font-semibold">Common Scope Examples:</h4>
						<div className="grid gap-2 md:grid-cols-2">
							<div className="space-y-2">
								{advanced.scopes.examples.slice(0, 3).map((example, index) => (
									<div key={index} className="p-2 rounded bg-muted">
										<code className="font-mono text-sm">{example}</code>
									</div>
								))}
							</div>
							<div className="space-y-2">
								{advanced.scopes.examples.slice(3).map((example, index) => (
									<div key={index} className="p-2 rounded bg-muted">
										<code className="font-mono text-sm">{example}</code>
									</div>
								))}
							</div>
						</div>
					</div>

					<div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
						<h4 className="mb-2 font-semibold text-blue-700 dark:text-blue-300">
							Scope Best Practices:
						</h4>
						<ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
							{advanced.scopes.bestPractices.map((practice, index) => (
								<li key={index}>• {practice}</li>
							))}
						</ul>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('BookOpen', 'w-6 h-6 text-green-500')}
						{advanced.bodyAndFooter.title}
					</CardTitle>
					<CardDescription className="text-base">
						{advanced.bodyAndFooter.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-3">
						<h4 className="font-semibold">Commit Body:</h4>
						<div className="p-4 border rounded-lg bg-muted">
							<code className="font-mono text-sm whitespace-pre-wrap">
								{advanced.bodyAndFooter.bodyExample}
							</code>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="font-semibold">Footer Examples:</h4>
						<div className="grid gap-2">
							{advanced.bodyAndFooter.footerExamples.map((example, index) => (
								<div key={index} className="p-3 border rounded-lg bg-muted">
									<code className="font-mono text-sm">{example.message}</code>
									<p className="mt-1 text-xs text-muted-foreground">
										{example.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2 text-xl">
						{getFontAwesomeIcon('Zap', 'w-6 h-6 text-purple-500')}
						{advanced.automation.title}
					</CardTitle>
					<CardDescription className="text-base">
						{advanced.automation.description}
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<h4 className="font-semibold">Version Management:</h4>
							<ul className="space-y-1 text-sm text-muted-foreground">
								{advanced.automation.versionManagement.map((tool, index) => (
									<li key={index}>
										• <strong>{tool}</strong>
									</li>
								))}
							</ul>
						</div>
						<div className="space-y-2">
							<h4 className="font-semibold">Validation:</h4>
							<ul className="space-y-1 text-sm text-muted-foreground">
								{advanced.automation.validation.map((tool, index) => (
									<li key={index}>
										• <strong>{tool}</strong>
									</li>
								))}
							</ul>
						</div>
					</div>

					<div className="p-4 border border-purple-200 rounded-lg bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800">
						<h4 className="mb-2 font-semibold text-purple-700 dark:text-purple-300">
							Benefits of Automation:
						</h4>
						<ul className="space-y-1 text-sm text-purple-600 dark:text-purple-400">
							{advanced.automation.benefits.map((benefit, index) => (
								<li key={index}>• {benefit}</li>
							))}
						</ul>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
