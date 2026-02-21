'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { useTranslation } from '@/hooks/useTranslation'
import { GitCommand, GitCommands } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useState } from 'react'

interface GitCommandsSectionProps {
	commands: GitCommands
}

export function GitCommandsSection({ commands }: GitCommandsSectionProps) {
	const { t } = useTranslation(['common', 'git-guide'])
	const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

	const copyToClipboard = async (text: string) => {
		await navigator.clipboard.writeText(text)
		setCopiedCommand(text)
		setTimeout(() => setCopiedCommand(null), 2000)
	}

	return (
		<div className="space-y-6">
			{Object.entries(commands).map(([category, commandList]) => (
				<Card key={category} className="overflow-hidden">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-xl">
							{getFontAwesomeIcon('Terminal', 'w-6 h-6')}
							{t(`git-guide:commands_${category}_title`)}
						</CardTitle>
						<CardDescription className="text-base">
							{t(`git-guide:commands_${category}_description`)}
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4">
							{commandList.map((cmd: GitCommand, index: number) => (
								<Card
									key={index}
									className="transition-all duration-300 ease-linear hover:border-l-4 hover:border-l-cyan-500 hover:shadow-lg hover:bg-gradient-to-r from-purple-50 to-cyan-50 hover:dark:from-cyan-900/20 hover:dark:to-blue-900/20"
								>
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-3 text-lg">
												{cmd.icon}
												<code className="px-3 py-1 font-mono text-blue-700 rounded bg-blue-50 dark:bg-blue-900/20 dark:text-blue-800">
													{cmd.command}
												</code>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(cmd.example || cmd.command)
												}
											>
												{copiedCommand === (cmd.example || cmd.command)
													? getFontAwesomeIcon(
															'Copy',
															'w-4 h-4 text-emerald-500',
													  )
													: getFontAwesomeIcon('Copy', 'w-4 h-4')}
											</Button>
										</div>
										<p className="mt-2 text-sm text-muted-foreground">
											{cmd.description}
										</p>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="p-3 rounded-lg bg-muted">
											<code className="font-mono text-sm">{cmd.example}</code>
										</div>

										<div className="space-y-3">
											<p className="text-sm text-muted-foreground">
												{cmd.details}
											</p>

											<div className="space-y-2">
												<h4 className="text-sm font-semibold">Use Cases:</h4>
												<ul className="space-y-1 text-sm text-muted-foreground">
													{cmd.useCases.map((useCase, useCaseIndex) => (
														<li
															key={useCaseIndex}
															className="flex items-start gap-2"
														>
															<span className="text-green-500 mt-0.5 flex-shrink-0">
																✓
															</span>
															<span>{useCase}</span>
														</li>
													))}
												</ul>
											</div>

											<div className="space-y-2">
												<h4 className="text-sm font-semibold">
													Common Options:
												</h4>
												<div className="grid gap-1">
													{cmd.options.map((option, optionIndex) => (
														<div
															key={optionIndex}
															className="p-2 rounded bg-muted/50"
														>
															<code className="font-mono text-xs">
																{option}
															</code>
														</div>
													))}
												</div>
											</div>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
