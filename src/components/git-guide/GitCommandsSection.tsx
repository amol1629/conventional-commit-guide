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
import toast from 'react-hot-toast'

interface GitCommandsSectionProps {
	commands: GitCommands
}

export function GitCommandsSection({ commands }: GitCommandsSectionProps) {
	const { t } = useTranslation(['common', 'git-guide'])
	const [copiedCommand, setCopiedCommand] = useState<string | null>(null)

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedCommand(text)
			toast.success('Copied to clipboard!')
			setTimeout(() => setCopiedCommand(null), 2000)
		} catch (error) {
			toast.error('Failed to copy to clipboard')
		}
	}

	return (
		<div className="space-y-6">
			{Object.entries(commands).map(([category, commandList]) => (
				<Card key={category} className="overflow-hidden">
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
							{getFontAwesomeIcon('Terminal', 'w-6 h-6 text-blue-600 dark:text-blue-400')}
							{t(`git-guide:commands_${category}_title`)}
						</CardTitle>
						<CardDescription className="text-base text-gray-600 dark:text-gray-300">
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
											<div className="flex items-center gap-3">
												<div className="text-blue-600 dark:text-blue-400">
													{cmd.icon}
												</div>
												<code className="px-3 py-1.5 font-mono text-sm font-semibold text-blue-700 dark:text-blue-300 rounded-md bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
													{cmd.command}
												</code>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(cmd.example || cmd.command)
												}
												className="h-8 w-8 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20"
												title="Copy command"
											>
												{copiedCommand === (cmd.example || cmd.command)
													? getFontAwesomeIcon(
															'Check',
															'w-4 h-4 text-emerald-600 dark:text-emerald-400',
													  )
													: getFontAwesomeIcon('Copy', 'w-4 h-4 text-gray-600 dark:text-gray-400')}
											</Button>
										</div>
										<p className="mt-3 text-sm font-medium text-gray-700 dark:text-gray-300">
											{cmd.description}
										</p>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="relative group">
											<div className="p-4 rounded-lg bg-gray-900 dark:bg-gray-800 border border-gray-700 dark:border-gray-700">
												<code className="font-mono text-sm text-gray-100 dark:text-gray-200">
													{cmd.example}
												</code>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => copyToClipboard(cmd.example)}
												className="absolute top-2 right-2 h-7 w-7 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800/80 hover:bg-gray-700/80 dark:bg-gray-700/80 dark:hover:bg-gray-600/80"
												title="Copy example"
											>
												{copiedCommand === cmd.example
													? getFontAwesomeIcon(
															'Check',
															'w-3.5 h-3.5 text-emerald-400',
													  )
													: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-300')}
											</Button>
										</div>

										<div className="space-y-3">
											<p className="text-sm text-muted-foreground">
												{cmd.details}
											</p>

											<div className="space-y-2">
												<h4 className="text-sm font-semibold text-gray-900 dark:text-white">Use Cases:</h4>
												<ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
													{cmd.useCases.map((useCase, useCaseIndex) => (
														<li
															key={useCaseIndex}
															className="flex items-start gap-2"
														>
															{getFontAwesomeIcon(
																'CheckCircle',
																'w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0'
															)}
															<span>{useCase}</span>
														</li>
													))}
												</ul>
											</div>

											<div className="space-y-2">
												<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
													Common Options:
												</h4>
												<div className="grid gap-2">
													{cmd.options.map((option, optionIndex) => (
														<div
															key={optionIndex}
															className="relative group p-2.5 rounded-md bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
														>
															<code className="font-mono text-xs text-gray-800 dark:text-gray-200">
																{option}
															</code>
															<Button
																variant="ghost"
																size="sm"
																onClick={() => copyToClipboard(option)}
																className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
																title="Copy option"
															>
																{copiedCommand === option
																	? getFontAwesomeIcon(
																			'Check',
																			'w-3 h-3 text-emerald-600 dark:text-emerald-400',
																	  )
																	: getFontAwesomeIcon('Copy', 'w-3 h-3 text-gray-500 dark:text-gray-400')}
															</Button>
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
