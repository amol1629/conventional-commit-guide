'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { GitHubFeature } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface GitHubFeaturesSectionProps {
	features: GitHubFeature[]
}

export function GitHubFeaturesSection({
	features,
}: GitHubFeaturesSectionProps) {
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
		<div className="grid gap-6 md:grid-cols-2">
			{features.map((feature, index) => (
				<Card
					key={index}
					className="overflow-hidden transition-all duration-300 hover:shadow-lg"
				>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
							<div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
								{feature.icon}
							</div>
							{feature.name}
						</CardTitle>
						<CardDescription className="text-base text-gray-600 dark:text-gray-300">
							{feature.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="p-3 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-900/20">
							<p className="text-sm font-medium text-blue-700 dark:text-blue-300">
								{feature.details}
							</p>
						</div>

						<div className="space-y-3">
							<div>
								<h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Key Benefits:</h4>
								<ul className="space-y-1.5">
									{feature.benefits.map((benefit, benefitIndex) => (
										<li
											key={benefitIndex}
											className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
										>
											{getFontAwesomeIcon(
												'CircleCheck',
												'w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0',
											)}
											{benefit}
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Use Cases:</h4>
								<ul className="space-y-1.5">
									{feature.useCases.map((useCase, useCaseIndex) => (
										<li
											key={useCaseIndex}
											className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
										>
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
								<h4 className="mb-2 text-sm font-semibold text-gray-900 dark:text-white">Best Practices:</h4>
								<ul className="space-y-1.5">
									{feature.bestPractices.map((practice, practiceIndex) => (
										<li
											key={practiceIndex}
											className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
										>
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
