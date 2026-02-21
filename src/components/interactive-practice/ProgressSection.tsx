import { PracticeScenario } from '@/data/practice-scenarios'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface ProgressSectionProps {
	currentScenario: number
	totalScenarios: number
	scenario: PracticeScenario
	score: number
	attempts: number
	maxAttempts: number
}

export default function ProgressSection({
	currentScenario,
	totalScenarios,
	scenario,
	score,
	attempts,
	maxAttempts,
}: ProgressSectionProps) {
	return (
		<div className="mb-8">
			<div className="flex items-center justify-between mb-4">
				<div className="flex items-center gap-3">
					<div className="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
						{currentScenario + 1}
					</div>
					<div>
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							{scenario.title}
						</h2>
						<p className="text-sm text-gray-600 dark:text-gray-300">
							Scenario {currentScenario + 1} of {totalScenarios}
						</p>
					</div>
				</div>
				<div className="flex gap-3">
					<div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 rounded-full dark:bg-yellow-900/30">
						{getFontAwesomeIcon('Trophy', 'w-4 h-4 text-yellow-600')}
						<span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
							{score} pts
						</span>
					</div>
					<div
						className={`flex items-center gap-2 px-3 py-2 rounded-full ${
							attempts >= maxAttempts
								? 'bg-red-100 dark:bg-red-900/30'
								: 'bg-blue-100 dark:bg-blue-900/30'
						}`}
					>
						{getFontAwesomeIcon('Clock', 'w-4 h-4 text-blue-600')}
						<span className="text-sm font-medium text-blue-800 dark:text-blue-200">
							{attempts}/{maxAttempts}
						</span>
					</div>
				</div>
			</div>
			<div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
				<div
					className="h-2 transition-all duration-500 ease-out rounded-full bg-gradient-to-r from-indigo-500 to-purple-600"
					style={{
						width: `${((currentScenario + 1) / totalScenarios) * 100}%`,
					}}
				></div>
			</div>
		</div>
	)
}
