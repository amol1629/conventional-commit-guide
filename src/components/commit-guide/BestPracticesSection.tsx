'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { BestPractice } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface BestPracticesSectionProps {
	practices: BestPractice[]
}

export function BestPracticesSection({ practices }: BestPracticesSectionProps) {
	return (
		<div className="grid gap-6">
			{practices.map((practice, index) => (
				<Card key={index} className="overflow-hidden">
					<CardHeader>
						<CardTitle className="flex items-center gap-2 text-lg">
							{practice.icon}
							{practice.title}
						</CardTitle>
						<CardDescription className="text-base">
							{practice.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						{practice.details && (
							<div className="p-3 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
								<p className="text-sm text-blue-700 dark:text-blue-300">
									<strong>Why:</strong> {practice.details}
								</p>
							</div>
						)}

						<div className="grid gap-4 md:grid-cols-2">
							<div>
								<div className="flex items-center gap-2 mb-2">
									{getFontAwesomeIcon('CheckCircle', 'w-4 h-4 text-green-500')}
									<span className="font-medium text-green-700 dark:text-green-300">
										Good Example
									</span>
								</div>
								<div className="p-3 border border-green-200 rounded-lg bg-green-50 dark:bg-green-900/20 dark:border-green-800">
									<code className="font-mono text-sm whitespace-pre-wrap">
										{practice.good}
									</code>
								</div>
							</div>
							<div>
								<div className="flex items-center gap-2 mb-2">
									{getFontAwesomeIcon('AlertTriangle', 'w-4 h-4 text-red-500')}
									<span className="font-medium text-red-700 dark:text-red-300">
										Bad Example
									</span>
								</div>
								<div className="p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800">
									<code className="font-mono text-sm whitespace-pre-wrap">
										{practice.bad}
									</code>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			))}
		</div>
	)
}
