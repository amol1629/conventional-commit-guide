import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { PracticeScenario } from '@/data/practice-scenarios'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'

interface ScenarioCardProps {
	scenario: PracticeScenario
	userCommit: string
	setUserCommit: (commit: string) => void
	onCheckCommit: () => void
	attempts: number
	maxAttempts: number
}

export default function ScenarioCard({
	scenario,
	userCommit,
	setUserCommit,
	onCheckCommit,
	attempts,
	maxAttempts,
}: ScenarioCardProps) {
	return (
		<Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm dark:bg-gray-800/95 animate-slide-up">
			<CardContent className="p-8">
				{/* Question Header */}
				<div className="mb-6">
					<div className="flex items-center gap-3 mb-4">
						<div className="flex items-center justify-center w-12 h-12 text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
							{getFontAwesomeIcon('Code', 'w-6 h-6')}
						</div>
						<div>
							<h3 className="text-xl font-bold text-gray-900 dark:text-white">
								{scenario.title}
							</h3>
							<p className="text-gray-600 dark:text-gray-300">
								{scenario.description}
							</p>
						</div>
					</div>

					{/* Context Card */}
					<div className="p-4 border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl dark:border-blue-800">
						<div className="flex items-center gap-2 mb-2">
							{getFontAwesomeIcon('Lightbulb', 'w-4 h-4 text-blue-600')}
							<h4 className="font-semibold text-blue-900 dark:text-blue-100">
								Context
							</h4>
						</div>
						<p className="text-blue-800 dark:text-blue-200">
							{scenario.context}
						</p>
					</div>
				</div>

				{/* Input Section */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label
							htmlFor="commit"
							className="text-lg font-semibold text-gray-900 dark:text-white"
						>
							Write your commit message:
						</Label>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="sm"
										className="w-8 h-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
									>
										{getFontAwesomeIcon(
											'Info',
											'w-4 h-4 text-gray-400 hover:text-gray-600',
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent className="p-4 w-80">
									<div className="space-y-3">
										<h4 className="font-semibold">💡 Practice Tips</h4>
										<div className="space-y-2 text-sm">
											<div className="flex items-start gap-2">
												<span className="text-green-600">•</span>
												<span>Use lowercase for type and scope</span>
											</div>
											<div className="flex items-start gap-2">
												<span className="text-green-600">•</span>
												<span>Keep description under 50 characters</span>
											</div>
											<div className="flex items-start gap-2">
												<span className="text-green-600">•</span>
												<span>Use imperative mood (add, fix, update)</span>
											</div>
											<div className="flex items-start gap-2">
												<span className="text-green-600">•</span>
												<span>Don&apos;t end with period</span>
											</div>
										</div>
									</div>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>

					<div className="relative">
						<Input
							id="commit"
							value={userCommit}
							onChange={(e) => setUserCommit(e.target.value)}
							placeholder="feat(auth): add user authentication"
							className="font-mono text-lg transition-colors border-2 h-14 focus:border-indigo-500"
							disabled={attempts >= maxAttempts}
						/>
						{userCommit && (
							<div className="absolute -translate-y-1/2 right-3 top-1/2">
								<div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
							</div>
						)}
					</div>

					{/* Modern Check Button */}
					<div className="flex justify-center">
						<Button
							onClick={onCheckCommit}
							className="text-lg font-semibold text-green-800 transition-all duration-300 ease-linear transform bg-green-100 border border-green-300 hover:shadow-md hover:shadow-green-200 h-14 hover:bg-green-200"
							disabled={attempts >= maxAttempts}
						>
							<div className="flex items-center justify-center gap-2">
								{getFontAwesomeIcon('Check', 'w-5 h-5')}
								<span>Check Answer</span>
							</div>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	)
}
