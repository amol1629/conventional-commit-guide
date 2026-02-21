import { Button } from '@/components/ui/button'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface NavigationButtonsProps {
	onReset: () => void
	onPrev: () => void
	onNext: () => void
	currentScenario: number
	totalScenarios: number
}

export default function NavigationButtons({
	onReset,
	onPrev,
	onNext,
	currentScenario,
	totalScenarios,
}: NavigationButtonsProps) {
	const isFirstQuestion = currentScenario === 0
	const isLastQuestion = currentScenario === totalScenarios - 1

	return (
		<div className="flex justify-center gap-4 mt-8">
			<Button
				onClick={onReset}
				className="h-12 px-6 text-red-600 transition-all duration-300 ease-linear border border-red-300 hover:bg-red-100 bg-red-50 hover:shadow-md hover:shadow-red-200"
			>
				{getFontAwesomeIcon('RefreshCw', 'w-4 h-4 mr-2')}
				Reset
			</Button>
			<Button
				variant="outline"
				onClick={onPrev}
				disabled={isFirstQuestion}
				className={`h-12 px-6 border-2 ${
					isFirstQuestion
						? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800'
						: 'hover:bg-gray-50 dark:hover:bg-gray-800'
				}`}
			>
				{getFontAwesomeIcon('ChevronLeft', 'w-4 h-4 mr-2')}
				Previous
			</Button>
			<Button
				onClick={onNext}
				disabled={isLastQuestion}
				className={`h-12 px-6 transition-all duration-300 ease-linear border ${
					isLastQuestion
						? 'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-800 border-gray-300 text-gray-500'
						: 'border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 hover:shadow-md hover:shadow-emerald-200'
				}`}
			>
				{getFontAwesomeIcon('ArrowRight', 'w-4 h-4 mr-2')}
				Next
			</Button>
		</div>
	)
}
