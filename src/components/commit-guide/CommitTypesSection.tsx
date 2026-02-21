'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { CommitType } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface CommitTypesSectionProps {
	commitTypes: CommitType[]
}

export function CommitTypesSection({ commitTypes }: CommitTypesSectionProps) {
	return (
		<div className="grid gap-6">
			{commitTypes.map((commitType) => (
				<Card key={commitType.type} className="overflow-hidden hover:shadow-md">
					<CardHeader>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<span className="text-2xl">{commitType.emoji}</span>
								<div>
									<CardTitle className="text-3xl">{commitType.type}</CardTitle>
									<CardDescription className="text-base italic">
										{commitType.description}
									</CardDescription>
								</div>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="p-4 rounded-lg bg-muted">
							<code className="font-mono text-sm">{commitType.example}</code>
						</div>

						<div className="space-y-3">
							<p className="text-sm text-muted-foreground">
								{commitType.details}
							</p>

							<div className="space-y-2">
								<h4 className="text-sm font-semibold">Use Cases:</h4>
								<ul className="space-y-1 text-muted-foreground">
									{commitType.useCases.map((useCase, index) => (
										<li key={index} className="flex items-start gap-2">
											{getFontAwesomeIcon(
												'CircleCheck',
												'w-4 h-4 text-green-500',
											)}
											<span>{useCase}</span>
										</li>
									))}
								</ul>
							</div>

							<div className="space-y-2">
								<h4 className="text-sm font-semibold">Examples:</h4>
								<div className="space-y-2">
									{commitType.examples.map((example, index) => (
										<div key={index} className="p-2 rounded bg-muted/50">
											<code className="font-mono text-xs">{example}</code>
										</div>
									))}
								</div>
							</div>

							{commitType.breakingChange && (
								<div className="space-y-2">
									<h4 className="text-sm font-semibold text-red-600 dark:text-red-400">
										Breaking Change Example:
									</h4>
									<div className="p-2 border border-red-200 rounded bg-red-50 dark:bg-red-900/20 dark:border-red-800">
										<code className="font-mono text-xs text-red-700 dark:text-red-300">
											{commitType.breakingChange}
										</code>
									</div>
								</div>
							)}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
