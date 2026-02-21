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

interface GitHubFeaturesSectionProps {
	features: GitHubFeature[]
}

export function GitHubFeaturesSection({
	features,
}: GitHubFeaturesSectionProps) {
	return (
		<div className="grid gap-6 md:grid-cols-2">
			{features.map((feature, index) => (
				<Card
					key={index}
					className="overflow-hidden transition-all duration-300 hover:shadow-lg"
				>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-lg">
							<div className="flex items-center justify-center w-10 h-10 text-white rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
								{feature.icon}
							</div>
							{feature.name}
						</CardTitle>
						<CardDescription className="text-base">
							{feature.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
							<p className="text-sm text-blue-700 dark:text-blue-300">
								{feature.details}
							</p>
						</div>

						<div className="space-y-3">
							<div>
								<h4 className="mb-2 text-sm font-semibold">Key Benefits:</h4>
								<ul className="space-y-1">
									{feature.benefits.map((benefit, benefitIndex) => (
										<li
											key={benefitIndex}
											className="flex items-center gap-2 text-sm text-muted-foreground"
										>
											{getFontAwesomeIcon(
												'CircleCheck',
												'w-4 h-4 text-green-500',
											)}
											{benefit}
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="mb-2 text-sm font-semibold">Use Cases:</h4>
								<ul className="space-y-1">
									{feature.useCases.map((useCase, useCaseIndex) => (
										<li
											key={useCaseIndex}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											{getFontAwesomeIcon(
												'ArrowRight',
												'w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0',
											)}
											<span>{useCase}</span>
										</li>
									))}
								</ul>
							</div>

							<div>
								<h4 className="mb-2 text-sm font-semibold">Best Practices:</h4>
								<ul className="space-y-1">
									{feature.bestPractices.map((practice, practiceIndex) => (
										<li
											key={practiceIndex}
											className="flex items-start gap-2 text-sm text-muted-foreground"
										>
											{getFontAwesomeIcon(
												'Lightbulb',
												'w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0',
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
