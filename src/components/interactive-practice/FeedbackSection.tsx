import { PracticeScenario } from '@/data/practice-scenarios'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface FeedbackSectionProps {
	showResult: boolean
	feedback: string[]
	isPerfect: boolean
	scenario: PracticeScenario
}

export default function FeedbackSection({
	showResult,
	feedback,
	isPerfect,
	scenario,
}: FeedbackSectionProps) {
	if (!showResult) return null

	return (
		<div className="p-6 mt-6 border-2 border-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-xl dark:border-gray-600 animate-slide-up">
			<div className="flex items-center gap-2 mb-4">
				{getFontAwesomeIcon('MessageSquare', 'w-5 h-5 text-indigo-600')}
				<h4 className="text-lg font-semibold text-gray-900 dark:text-white">
					Feedback
				</h4>
			</div>
			<div className="space-y-3">
				{feedback.map((item, index) => (
					<div
						key={index}
						className="flex items-center gap-3 p-3 bg-white border rounded-lg dark:bg-gray-800"
					>
						{item}
					</div>
				))}
			</div>
			{!isPerfect && (
				<div className="p-4 mt-4 border border-blue-200 rounded-lg bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
					<p className="text-sm font-medium text-blue-800 dark:text-blue-200">
						<strong>Expected:</strong> {scenario.expectedType}(
						{scenario.expectedScope}): {scenario.expectedDescription}
						{scenario.breakingChange && '!'}
					</p>
				</div>
			)}
		</div>
	)
}
