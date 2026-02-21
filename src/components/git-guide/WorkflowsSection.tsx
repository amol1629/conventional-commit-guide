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
						<CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900 dark:text-white">
							<div className="text-blue-600 dark:text-blue-400">
								{workflow.icon}
							</div>
							{workflow.name}
						</CardTitle>
						<CardDescription className="text-base text-gray-600 dark:text-gray-300">
							{workflow.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
							<p className="text-sm font-medium text-blue-700 dark:text-blue-300">
								{workflow.details}
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h4 className="mb-3 text-lg font-semibold text-gray-900 dark:text-white">Workflow Steps:</h4>
								<ol className="space-y-2.5">
									{workflow.steps.map((step, stepIndex) => (
										<li key={stepIndex} className="flex items-start gap-3">
											<span className="w-6 h-6 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300 mt-0.5 flex-shrink-0">
												{stepIndex + 1}
											</span>
											<span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
										</li>
									))}
								</ol>
							</div>

							<div className="space-y-4">
								<div>
									<h4 className="mb-2 font-semibold text-emerald-600 dark:text-emerald-400">
										Pros:
									</h4>
									<ul className="space-y-1.5 text-sm">
										{workflow.pros.map((pro, proIndex) => (
											<li key={proIndex} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
												{getFontAwesomeIcon(
													'CheckCircle',
													'w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0',
												)}
												{pro}
											</li>
										))}
									</ul>
								</div>
								<div>
									<h4 className="mb-2 font-semibold text-orange-600 dark:text-orange-400">
										Cons:
									</h4>
									<ul className="space-y-1.5 text-sm">
										{workflow.cons.map((con, conIndex) => (
											<li key={conIndex} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
												{getFontAwesomeIcon(
													'AlertTriangle',
													'w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0',
												)}
												{con}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Use Cases:</h4>
								<ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
									{workflow.useCases.map((useCase, useCaseIndex) => (
										<li key={useCaseIndex} className="flex items-start gap-2">
											{getFontAwesomeIcon(
												'ArrowRight',
												'w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0',
											)}
											<span>{useCase}</span>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="mb-2 font-semibold text-gray-900 dark:text-white">Best Practices:</h4>
								<ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
									{workflow.bestPractices.map((practice, practiceIndex) => (
										<li key={practiceIndex} className="flex items-start gap-2">
											{getFontAwesomeIcon(
												'Lightbulb',
												'w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0',
											)}
											<span>{practice}</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
