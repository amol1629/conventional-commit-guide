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
						<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
							{getFontAwesomeIcon('Terminal', 'w-7 h-7 text-blue-600 dark:text-blue-400')}
							{t(`git-guide:commands_${category}_title`)}
						</CardTitle>
						<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
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
									<CardHeader className="pb-4">
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-4">
												<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-2 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all">
													<div className="text-2xl">
														{cmd.icon}
													</div>
												</div>
												<code className="px-4 py-2 font-mono text-base font-bold text-blue-700 dark:text-blue-300 rounded-lg bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-800 shadow-sm">
													{cmd.command}
												</code>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() =>
													copyToClipboard(cmd.example || cmd.command)
												}
												className="h-9 w-9 p-0 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
												title="Copy command"
											>
												{copiedCommand === (cmd.example || cmd.command)
													? getFontAwesomeIcon(
															'Check',
															'w-5 h-5 text-emerald-600 dark:text-emerald-400',
													  )
													: getFontAwesomeIcon('Copy', 'w-5 h-5 text-gray-600 dark:text-gray-400')}
											</Button>
										</div>
										<p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-300">
											{cmd.description}
										</p>
									</CardHeader>
									<CardContent className="space-y-5">
										<div className="relative group">
											<div className="p-5 rounded-lg bg-gray-900 dark:bg-gray-800 border-2 border-gray-700 dark:border-gray-700 shadow-inner">
												<code className="font-mono text-base text-gray-100 dark:text-gray-200 leading-relaxed">
													{cmd.example}
												</code>
											</div>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => copyToClipboard(cmd.example)}
												className="absolute top-3 right-3 h-8 w-8 p-0 opacity-100 transition-all bg-gray-800/90 hover:bg-gray-700/90 dark:bg-gray-700/90 dark:hover:bg-gray-600/90 rounded-lg shadow-lg"
												title="Copy example"
											>
												{copiedCommand === cmd.example
													? getFontAwesomeIcon(
															'Check',
															'w-4 h-4 text-emerald-400',
													  )
													: getFontAwesomeIcon('Copy', 'w-4 h-4 text-gray-300')}
											</Button>
										</div>

										<div className="space-y-4">
											<p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
												{cmd.details}
											</p>

											<div className="space-y-3">
												<h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
													{getFontAwesomeIcon('ListCheck', 'w-5 h-5 text-green-600 dark:text-green-400')}
													Use Cases:
												</h4>
												<ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
													{cmd.useCases.map((useCase, useCaseIndex) => (
														<li
															key={useCaseIndex}
															className="flex items-start gap-3"
														>
															{getFontAwesomeIcon(
																'CheckCircle',
																'w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0'
															)}
															<span className="leading-relaxed">{useCase}</span>
														</li>
													))}
												</ul>
											</div>

											<div className="space-y-3">
												<h4 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
													{getFontAwesomeIcon('Code', 'w-5 h-5 text-purple-600 dark:text-purple-400')}
													Common Options:
												</h4>
												<div className="grid gap-3">
													{cmd.options.map((option, optionIndex) => (
														<div
															key={optionIndex}
															className="relative group p-4 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-shadow"
														>
															<div className="flex items-center gap-3">
																{getFontAwesomeIcon('Terminal', 'w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0')}
																<code className="font-mono text-base font-semibold text-gray-800 dark:text-gray-200 flex-1">
																	{option}
																</code>
															</div>
															<Button
																variant="ghost"
																size="sm"
																onClick={() => copyToClipboard(option)}
																className="absolute top-2 right-2 h-7 w-7 p-0 opacity-100 transition-all bg-white/80 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700/80 rounded-lg shadow-sm"
																title="Copy option"
															>
																{copiedCommand === option
																	? getFontAwesomeIcon(
																			'Check',
																			'w-4 h-4 text-emerald-600 dark:text-emerald-400',
																	  )
																	: getFontAwesomeIcon('Copy', 'w-4 h-4 text-gray-600 dark:text-gray-400')}
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
