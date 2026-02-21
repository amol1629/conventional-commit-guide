'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Achievement, LearningStats } from '@/types/database'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useEffect, useState } from 'react'

interface StatsDashboardProps {
	stats: LearningStats
	onAchievementClick?: (achievement: Achievement) => void
}

export default function StatsDashboard({
	stats,
	onAchievementClick,
}: StatsDashboardProps) {
	const [achievements, setAchievements] = useState<Achievement[]>([])

	useEffect(() => {
		// Load achievement details
		const loadAchievements = async () => {
			const achievementDetails = await Promise.all(
				stats.achievements.map(async (achievementId) => {
					const { progressService } = await import(
						'@/services/progress.service'
					)
					return progressService.getAchievementDetails(achievementId)
				}),
			)
			const validAchievements = achievementDetails.filter(
				Boolean,
			) as unknown as Achievement[]
			setAchievements(validAchievements)
		}

		loadAchievements()
	}, [stats.achievements])

	// Unused function - commented out to fix build errors

	const getStreakColor = (streak: number): string => {
		if (streak >= 7) return 'text-orange-600'
		if (streak >= 3) return 'text-yellow-600'
		return 'text-gray-600'
	}

	// const getProgressColor = (progress: number): string => {
	// 	if (progress >= 80) return 'text-green-600'
	// 	if (progress >= 50) return 'text-yellow-600'
	// 	return 'text-red-600'
	// }

	return (
		<div className="space-y-6">
			{/* Main Stats Grid */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				{/* Total Progress */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Overall Progress
						</CardTitle>
						{getFontAwesomeIcon('Target', 'w-4 h-4 text-muted-foreground')}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalProgress}%</div>
						<Progress value={stats.totalProgress} className="mt-2" />
						<p className="mt-1 text-xs text-muted-foreground">
							{stats.completedModules} of {stats.totalModules} modules completed
						</p>
					</CardContent>
				</Card>

				{/* Learning Streak */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Learning Streak
						</CardTitle>
						{getFontAwesomeIcon('Flame', 'w-4 h-4 text-orange-500')}
					</CardHeader>
					<CardContent>
						<div
							className={`text-2xl font-bold ${getStreakColor(stats.streak)}`}
						>
							{stats.streak} days
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							{stats.streak >= 7 ? '🔥 Amazing streak!' : 'Keep it up!'}
						</p>
					</CardContent>
				</Card>

				{/* Time Spent */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">Time Invested</CardTitle>
						{getFontAwesomeIcon('Clock', 'w-4 h-4 text-blue-500')}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">{stats.totalTimeSpent}</div>
						<p className="mt-1 text-xs text-muted-foreground">
							Total learning time
						</p>
					</CardContent>
				</Card>

				{/* Completion Rate */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
						<CardTitle className="text-sm font-medium">
							Completion Rate
						</CardTitle>
						{getFontAwesomeIcon('CheckCircle', 'w-4 h-4 text-green-500')}
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{stats.totalModules > 0
								? Math.round(
										(stats.completedModules / stats.totalModules) * 100,
									)
								: 0}
							%
						</div>
						<p className="mt-1 text-xs text-muted-foreground">
							Modules completed
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Achievements Section */}
			{achievements.length > 0 && (
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							{getFontAwesomeIcon('Trophy', 'w-5 h-5 text-yellow-500')}
							Achievements
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
							{achievements.map((achievement) => (
								<div
									key={achievement.achievementId}
									className="p-4 transition-colors border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
									onClick={() => onAchievementClick?.(achievement)}
								>
									<div className="flex items-start gap-3">
										<div className="flex-shrink-0">
											{getFontAwesomeIcon(
												achievement.icon,
												'w-6 h-6 text-yellow-500',
											)}
										</div>
										<div className="flex-1 min-w-0">
											<h4 className="text-sm font-semibold text-gray-900 dark:text-white">
												{achievement.title}
											</h4>
											<p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
												{achievement.description}
											</p>
											<Badge variant="secondary" className="mt-2 text-xs">
												{achievement.category}
											</Badge>
										</div>
									</div>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}

			{/* Learning Insights */}
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{getFontAwesomeIcon('Lightbulb', 'w-5 h-5 text-blue-500')}
						Learning Insights
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{stats.totalProgress >= 80 && (
							<div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
								{getFontAwesomeIcon('CheckCircle', 'w-5 h-5 text-green-600')}
								<span className="text-sm text-green-800 dark:text-green-200">
									Excellent progress! You&apos;re mastering conventional
									commits.
								</span>
							</div>
						)}

						{stats.streak >= 3 && stats.streak < 7 && (
							<div className="flex items-center gap-3 p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20">
								{getFontAwesomeIcon('Flame', 'w-5 h-5 text-orange-600')}
								<span className="text-sm text-orange-800 dark:text-orange-200">
									Great streak! Keep learning daily to reach 7 days.
								</span>
							</div>
						)}

						{stats.totalTimeSpent >= 30 && (
							<div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
								{getFontAwesomeIcon('Clock', 'w-5 h-5 text-blue-600')}
								<span className="text-sm text-blue-800 dark:text-blue-200">
									You&apos;ve invested significant time in learning. Keep it up!
								</span>
							</div>
						)}

						{stats.completedModules === 0 && (
							<div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
								{getFontAwesomeIcon('BookOpen', 'w-5 h-5 text-gray-600')}
								<span className="text-sm text-gray-700 dark:text-gray-300">
									Start your learning journey by completing your first module!
								</span>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
