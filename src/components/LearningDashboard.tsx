'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface LearningHistoryEntry {
	_id: string
	activityType: string
	moduleId?: string
	moduleTitle?: string
	progress?: number
	timeSpent?: number
	timestamp: string
	metadata?: Record<string, unknown>
}

interface LearningDashboardProps {
	userId: string
}

export default function LearningDashboard({ userId }: LearningDashboardProps) {
	const router = useRouter()
	const [learningHistory, setLearningHistory] = useState<
		LearningHistoryEntry[]
	>([])
	const [isLoading, setIsLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('all')

	useEffect(() => {
		const loadLearningHistory = async () => {
			try {
				setIsLoading(true)

				// Load learning history
				const historyResponse = await fetch(
					`/api/learning-history?userId=${userId}&limit=50`,
				)
				const historyData = await historyResponse.json()

				// Load commits practice data
				const commitsResponse = await fetch(
					`/api/commits-practice?userId=${userId}&limit=20`,
				)
				const commitsData = await commitsResponse.json()

				// Load learning sessions
				const sessionsResponse = await fetch(
					`/api/learning-sessions?userId=${userId}&limit=10`,
				)
				const sessionsData = await sessionsResponse.json()

				// Load conventional commits activities
				const conventionalCommitsResponse = await fetch(
					`/api/conventional-commits?userId=${userId}&limit=20`,
				)
				const conventionalCommitsData = await conventionalCommitsResponse.json()

				if (historyData.success) {
					// Combine all learning activities
					const allActivities = [
						...historyData.data,
						...(commitsData.success
							? commitsData.data.practiceSessions.map(
									(session: Record<string, unknown>) => ({
										_id: session._id,
										activityType: 'commit_practice',
										moduleId: session.moduleId,
										moduleTitle: session.moduleTitle,
										progress: session.success ? 100 : 0,
										timeSpent: session.timeSpent || 0,
										timestamp: session.timestamp,
										metadata: {
											...(session.metadata as Record<string, unknown>),
											commitMessage: session.commitMessage,
											success: session.success,
											attempts: session.attempts,
										},
									}),
								)
							: []),
						...(sessionsData.success
							? sessionsData.data.sessions.map(
									(session: Record<string, unknown>) => ({
										_id: session._id,
										activityType: 'learning_session',
										moduleId: session.moduleId,
										moduleTitle: session.moduleTitle,
										progress: 100,
										timeSpent: session.duration || 0,
										timestamp: session.startTime,
										metadata: {
											...(session.metadata as Record<string, unknown>),
											sessionId: session.sessionId,
											activities: session.activities,
										},
									}),
								)
							: []),
						...(conventionalCommitsData.success
							? conventionalCommitsData.data.activities.map(
									(activity: Record<string, unknown>) => ({
										_id: activity._id,
										activityType: activity.activityType,
										moduleId: activity.lessonId || 'conventional-commits',
										moduleTitle:
											activity.lessonTitle || 'Master Conventional Commits',
										progress: activity.progress || 0,
										timeSpent: activity.timeSpent || 0,
										timestamp: activity.timestamp,
										metadata: {
											...(activity.metadata as Record<string, unknown>),
											lessonId: activity.lessonId,
											lessonTitle: activity.lessonTitle,
										},
									}),
								)
							: []),
					]

					// Filter to only show Team Training, Interactive Practice, and Conventional Commits activities
					const filteredActivities = allActivities.filter((activity) => {
						const moduleId = activity.moduleId?.toLowerCase() || ''
						const moduleTitle = activity.moduleTitle?.toLowerCase() || ''

						return (
							moduleId.includes('team-training') ||
							moduleId.includes('interactive-practice') ||
							moduleId.includes('conventional-commits') ||
							moduleTitle.includes('team training') ||
							moduleTitle.includes('interactive practice') ||
							moduleTitle.includes('commit practice') ||
							moduleTitle.includes('master conventional commits')
						)
					})

					// Sort by timestamp
					filteredActivities.sort(
						(a, b) =>
							new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
					)

					setLearningHistory(filteredActivities)
				}
			} catch (error) {
				console.error('Error loading learning history:', error)
			} finally {
				setIsLoading(false)
			}
		}

		loadLearningHistory()
	}, [userId])

	const navigateToActivity = (activity: LearningHistoryEntry) => {
		const moduleId = activity.moduleId?.toLowerCase() || ''
		const moduleTitle = activity.moduleTitle?.toLowerCase() || ''

		// Navigate based on module
		if (
			moduleId.includes('team-training') ||
			moduleTitle.includes('team training')
		) {
			router.push('/team-training')
		} else if (
			moduleId.includes('interactive-practice') ||
			moduleTitle.includes('interactive practice') ||
			moduleTitle.includes('commit practice')
		) {
			router.push('/interactive-practice')
		} else if (
			moduleId.includes('conventional-commits') ||
			moduleTitle.includes('master conventional commits')
		) {
			router.push('/guide') // Navigate to the conventional commits guide page
		} else {
			// Default fallback
			router.push('/home')
		}
	}

	const getActivityIcon = (activityType: string) => {
		switch (activityType) {
			case 'module_selected':
			case 'module_start':
				return 'Play'
			case 'video_selected':
			case 'video_play':
				return 'PlayCircle'
			case 'video_pause':
				return 'Pause'
			case 'video_progress':
				return 'Clock'
			case 'video_completed':
				return 'CheckCircle'
			case 'module_progress':
				return 'TrendingUp'
			case 'module_completed':
				return 'Award'
			case 'commit_practice':
				return 'Code'
			case 'learning_session':
				return 'BookOpen'
			case 'user_interaction':
				return 'MousePointer'
			case 'session_end':
				return 'LogOut'
			default:
				return 'Activity'
		}
	}

	const getActivityDescription = (entry: LearningHistoryEntry) => {
		switch (entry.activityType) {
			case 'module_selected':
				return 'Selected module'
			case 'video_selected':
				return 'Selected video'
			case 'video_play':
				return 'Started watching'
			case 'video_pause':
				return 'Paused video'
			case 'video_progress':
				return `${entry.metadata?.progressPercentage || 0}% watched`
			case 'video_completed':
				return 'Completed video'
			case 'module_progress':
				return `${entry.progress}% complete`
			case 'module_completed':
				return 'Completed module'
			case 'commit_practice':
				return entry.metadata?.success
					? 'Successful practice'
					: 'Practice attempt'
			case 'learning_session':
				return `Learning session (${entry.timeSpent}m)`
			case 'user_interaction':
				return `Interacted: ${entry.metadata?.interactionType || 'Unknown'}`
			case 'session_end':
				return 'Ended session'
			default:
				return 'Activity'
		}
	}

	const formatTime = (timestamp: string) => {
		const date = new Date(timestamp)
		const now = new Date()
		const diffInMinutes = Math.floor(
			(now.getTime() - date.getTime()) / (1000 * 60),
		)

		if (diffInMinutes < 1) return 'Just now'
		if (diffInMinutes < 60) return `${diffInMinutes}m ago`
		if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
		return date.toLocaleDateString()
	}

	const filteredHistory = learningHistory.filter((entry) => {
		if (activeTab === 'all') return true
		return entry.activityType === activeTab
	})

	const activityTypes = [
		{ value: 'all', label: 'All Activities', count: learningHistory.length },
		{
			value: 'module_selected',
			label: 'Module Selection',
			count: learningHistory.filter((e) => e.activityType === 'module_selected')
				.length,
		},
		{
			value: 'video_play',
			label: 'Video Watching',
			count: learningHistory.filter((e) => e.activityType === 'video_play')
				.length,
		},
		{
			value: 'commit_practice',
			label: 'Commit Practice',
			count: learningHistory.filter((e) => e.activityType === 'commit_practice')
				.length,
		},
		{
			value: 'module_progress',
			label: 'Progress Updates',
			count: learningHistory.filter((e) => e.activityType === 'module_progress')
				.length,
		},
		{
			value: 'module_completed',
			label: 'Completions',
			count: learningHistory.filter(
				(e) => e.activityType === 'module_completed',
			).length,
		},
		{
			value: 'learning_session',
			label: 'Learning Sessions',
			count: learningHistory.filter(
				(e) => e.activityType === 'learning_session',
			).length,
		},
	]

	return (
		<Card className="bg-white border-0 shadow-lg rounded-2xl">
			<CardHeader>
				<CardTitle className="text-2xl font-bold text-purple-800">
					Learning Dashboard
				</CardTitle>
				<p className="text-gray-600">
					Track your detailed learning journey and progress
				</p>
			</CardHeader>
			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-6">
						{activityTypes.map((type) => (
							<TabsTrigger
								key={type.value}
								value={type.value}
								className="text-xs"
							>
								{type.label} ({type.count})
							</TabsTrigger>
						))}
					</TabsList>

					<TabsContent value={activeTab} className="mt-6">
						{isLoading ? (
							<div className="flex items-center justify-center py-8">
								<LoadingSpinner size="md" variant="default" />
								<span className="ml-2 text-gray-600">
									Loading learning history...
								</span>
							</div>
						) : filteredHistory.length > 0 ? (
							<div className="space-y-3 max-h-96 overflow-y-auto">
								{filteredHistory.map((entry) => (
									<div
										key={entry._id}
										className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
										onClick={() => navigateToActivity(entry)}
									>
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-lg">
												{getFontAwesomeIcon(
													getActivityIcon(entry.activityType),
													'w-5 h-5 text-purple-600',
												)}
											</div>
											<div>
												<div className="font-medium text-gray-900">
													{entry.moduleTitle ||
														entry.moduleId ||
														'Unknown Module'}
												</div>
												<div className="text-sm text-gray-600">
													{getActivityDescription(entry)}
												</div>
												{entry.metadata?.videoTitle ? (
													<div className="text-xs text-gray-500">
														Video: {String(entry.metadata.videoTitle)}
													</div>
												) : null}
												{entry.metadata?.commitMessage ? (
													<div className="text-xs text-gray-500">
														Commit: {String(entry.metadata.commitMessage)}
													</div>
												) : null}
											</div>
										</div>
										<div className="text-right">
											<div className="text-sm text-gray-500">
												{formatTime(entry.timestamp)}
											</div>
											{entry.timeSpent && entry.timeSpent > 0 && (
												<div className="text-xs text-gray-400">
													{entry.timeSpent}m
												</div>
											)}
											<div className="text-xs text-purple-600 mt-1">
												Click to continue →
											</div>
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="py-8 text-center">
								<div className="mb-4 text-gray-500">
									{getFontAwesomeIcon(
										'Book',
										'w-12 h-12 mx-auto mb-2 text-gray-300',
									)}
								</div>
								<p className="mb-4 text-gray-600">No learning activities yet</p>
								<p className="text-sm text-gray-500">
									Start learning to see your detailed progress here!
								</p>
							</div>
						)}
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
