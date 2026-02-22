'use client'

import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Workflow } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface WorkflowsSectionProps {
	workflows: Workflow[]
}

export function WorkflowsSection({ workflows }: WorkflowsSectionProps) {
	const [copiedText, setCopiedText] = useState<string | null>(null)

	const copyToClipboard = async (text: string) => {
		try {
			await navigator.clipboard.writeText(text)
			setCopiedText(text)
			toast.success('Copied to clipboard!')
			setTimeout(() => setCopiedText(null), 2000)
		} catch (error) {
			toast.error('Failed to copy to clipboard')
		}
	}

	return (
		<div className="space-y-6">
			{workflows.map((workflow, index) => (
				<Card
					key={index}
					className="overflow-hidden transition-all duration-300 hover:shadow-lg"
				>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900 dark:text-white">
							<div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-900/30 dark:via-purple-900/30 dark:to-pink-900/30 border-2 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all">
								{workflow.icon}
							</div>
							{workflow.name}
						</CardTitle>
						<CardDescription className="text-lg text-gray-600 dark:text-gray-300">
							{workflow.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="p-5 border-2 border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
							<p className="text-base font-medium leading-relaxed text-blue-700 dark:text-blue-300">
								{workflow.details}
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h4 className="mb-4 text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
									{getFontAwesomeIcon('List', 'w-5 h-5 text-blue-600 dark:text-blue-400')}
									Workflow Steps:
								</h4>
								<ol className="space-y-3">
									{workflow.steps.map((step, stepIndex) => {
										// Check if step contains git commands or code
										const hasCode = /git\s+\w+|`|```/.test(step)
										const codeMatch = step.match(/`([^`]+)`|git\s+[\w\s-]+/)
										const codeToCopy = codeMatch ? (codeMatch[1] || codeMatch[0]) : null

										return (
											<li key={stepIndex} className="flex items-start gap-3 group">
												<span className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white mt-0.5 flex-shrink-0 shadow-md">
													{stepIndex + 1}
												</span>
												<div className="flex-1 relative">
													<span className="text-base text-gray-700 dark:text-gray-300 leading-relaxed">{step}</span>
													{codeToCopy && (
														<Button
															variant="ghost"
															size="sm"
															onClick={() => copyToClipboard(codeToCopy)}
															className="absolute -right-8 top-0 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
															title="Copy command"
														>
															{copiedText === codeToCopy
																? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
																: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
														</Button>
													)}
												</div>
											</li>
										)
									})}
								</ol>
							</div>

							<div className="space-y-4">
								<div>
									<h4 className="mb-3 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-lg">
										{getFontAwesomeIcon('CheckCircle', 'w-5 h-5 text-emerald-600 dark:text-emerald-400')}
										Pros:
									</h4>
									<ul className="space-y-2 text-base">
										{workflow.pros.map((pro, proIndex) => (
											<li key={proIndex} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
												{getFontAwesomeIcon(
													'CheckCircle',
													'w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0',
												)}
												<span className="leading-relaxed">{pro}</span>
											</li>
										))}
									</ul>
								</div>
								<div>
									<h4 className="mb-3 font-bold text-orange-600 dark:text-orange-400 flex items-center gap-2 text-lg">
										{getFontAwesomeIcon('AlertTriangle', 'w-5 h-5 text-orange-600 dark:text-orange-400')}
										Cons:
									</h4>
									<ul className="space-y-2 text-base">
										{workflow.cons.map((con, conIndex) => (
											<li key={conIndex} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
												{getFontAwesomeIcon(
													'AlertTriangle',
													'w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0',
												)}
												<span className="leading-relaxed">{con}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<h4 className="mb-3 font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
									{getFontAwesomeIcon('ArrowRight', 'w-5 h-5 text-blue-600 dark:text-blue-400')}
									Use Cases:
								</h4>
								<ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
									{workflow.useCases.map((useCase, useCaseIndex) => (
										<li key={useCaseIndex} className="flex items-start gap-3">
											{getFontAwesomeIcon(
												'ArrowRight',
												'w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
											)}
											<span className="leading-relaxed">{useCase}</span>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="mb-3 font-bold text-gray-900 dark:text-white flex items-center gap-2 text-lg">
									{getFontAwesomeIcon('Lightbulb', 'w-5 h-5 text-yellow-600 dark:text-yellow-400')}
									Best Practices:
								</h4>
								<ul className="space-y-2 text-base text-gray-700 dark:text-gray-300">
									{workflow.bestPractices.map((practice, practiceIndex) => {
										// Check if practice contains git commands
										const hasCode = /git\s+\w+|`|```/.test(practice)
										const codeMatch = practice.match(/`([^`]+)`|git\s+[\w\s-]+/)
										const codeToCopy = codeMatch ? (codeMatch[1] || codeMatch[0]) : null

										return (
											<li key={practiceIndex} className="flex items-start gap-3 group relative">
												{getFontAwesomeIcon(
													'Lightbulb',
													'w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0',
												)}
												<span className="leading-relaxed flex-1">{practice}</span>
												{codeToCopy && (
													<Button
														variant="ghost"
														size="sm"
														onClick={() => copyToClipboard(codeToCopy)}
														className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
														title="Copy command"
													>
														{copiedText === codeToCopy
															? getFontAwesomeIcon('Check', 'w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400')
															: getFontAwesomeIcon('Copy', 'w-3.5 h-3.5 text-gray-500 dark:text-gray-400')}
													</Button>
												)}
											</li>
										)
									})}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
