'use client'

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Workflow } from '@/types'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface WorkflowsSectionProps {
	workflows: Workflow[]
}

export function WorkflowsSection({ workflows }: WorkflowsSectionProps) {
	return (
		<div className="space-y-6">
			{workflows.map((workflow, index) => (
				<Card
					key={index}
					className="overflow-hidden transition-all duration-300 hover:shadow-lg"
				>
					<CardHeader>
						<CardTitle className="flex items-center gap-3 text-xl">
							{workflow.icon}
							{workflow.name}
						</CardTitle>
						<CardDescription className="text-base">
							{workflow.description}
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="p-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
							<p className="text-sm text-blue-700 dark:text-blue-300">
								{workflow.details}
							</p>
						</div>

						<div className="grid gap-6 md:grid-cols-2">
							<div>
								<h4 className="mb-3 text-lg font-semibold">Workflow Steps:</h4>
								<ol className="space-y-2">
									{workflow.steps.map((step, stepIndex) => (
										<li key={stepIndex} className="flex items-start gap-3">
											<span className="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0">
												{stepIndex + 1}
											</span>
											<span className="text-sm">{step}</span>
										</li>
									))}
								</ol>
							</div>

							<div className="space-y-4">
								<div>
									<h4 className="mb-2 font-semibold text-emerald-600 dark:text-emerald-400">
										Pros:
									</h4>
									<ul className="space-y-1 text-sm">
										{workflow.pros.map((pro, proIndex) => (
											<li key={proIndex} className="flex items-center gap-2">
												{getFontAwesomeIcon(
													'CheckCircle',
													'w-4 h-4 text-emerald-500',
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
									<ul className="space-y-1 text-sm">
										{workflow.cons.map((con, conIndex) => (
											<li key={conIndex} className="flex items-center gap-2">
												{getFontAwesomeIcon(
													'AlertTriangle',
													'w-4 h-4 text-orange-500',
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
								<h4 className="mb-2 font-semibold">Use Cases:</h4>
								<ul className="space-y-1 text-sm text-muted-foreground">
									{workflow.useCases.map((useCase, useCaseIndex) => (
										<li key={useCaseIndex} className="flex items-start gap-2">
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
								<h4 className="mb-2 font-semibold">Best Practices:</h4>
								<ul className="space-y-1 text-sm text-muted-foreground">
									{workflow.bestPractices.map((practice, practiceIndex) => (
										<li key={practiceIndex} className="flex items-start gap-2">
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
