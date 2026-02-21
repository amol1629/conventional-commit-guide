import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId') || 'test-user-123'

		// Test all components of the learning dashboard
		const results = {
			learningHistory: await databaseService.getLearningHistory(userId, 20),
			commitsPractice: await databaseService.getCommitsPractice(userId, 20),
			learningSessions: await databaseService.getLearningSessions(userId, 10),
			videos: await databaseService.getVideos(undefined, undefined, 20),
		}

		// Filter activities like the dashboard does
		const allActivities = [
			...results.learningHistory,
			...results.commitsPractice.practiceSessions.map((session: Record<string, unknown>) => ({
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
			})),
			...results.learningSessions.sessions.map((session: Record<string, unknown>) => ({
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
			})),
		]

		// Filter to only show Team Training and Interactive Practice activities
		const filteredActivities = allActivities.filter((activity) => {
			const moduleId = activity.moduleId?.toLowerCase() || ''
			const moduleTitle = activity.moduleTitle?.toLowerCase() || ''

			return (
				moduleId.includes('team-training') ||
				moduleId.includes('interactive-practice') ||
				moduleTitle.includes('team training') ||
				moduleTitle.includes('interactive practice') ||
				moduleTitle.includes('commit practice')
			)
		})

		// Count by activity type
		const activityCounts = {
			all: filteredActivities.length,
			module_selected: filteredActivities.filter(
				(a) => a.activityType === 'module_selected',
			).length,
			video_selected: filteredActivities.filter(
				(a) => a.activityType === 'video_selected',
			).length,
			video_play: filteredActivities.filter(
				(a) => a.activityType === 'video_play',
			).length,
			video_progress: filteredActivities.filter(
				(a) => a.activityType === 'video_progress',
			).length,
			video_completed: filteredActivities.filter(
				(a) => a.activityType === 'video_completed',
			).length,
			commit_practice: filteredActivities.filter(
				(a) => a.activityType === 'commit_practice',
			).length,
			module_progress: filteredActivities.filter(
				(a) => a.activityType === 'module_progress',
			).length,
			module_completed: filteredActivities.filter(
				(a) => a.activityType === 'module_completed',
			).length,
			learning_session: filteredActivities.filter(
				(a) => a.activityType === 'learning_session',
			).length,
		}

		return NextResponse.json({
			success: true,
			message: 'Learning Dashboard test completed successfully',
			data: {
				totalActivities: filteredActivities.length,
				activityCounts,
				recentActivities: filteredActivities.slice(0, 5),
				commitsPracticeStats: {
					totalPracticeCount: results.commitsPractice.totalPracticeCount,
					successfulPracticeCount:
						results.commitsPractice.successfulPracticeCount,
					successRate: results.commitsPractice.successRate,
				},
				videosCount: results.videos.length,
			},
		})
	} catch (error) {
		console.error('Error testing learning dashboard:', error)
		return NextResponse.json(
			{ success: false, error: 'Learning dashboard test failed' },
			{ status: 500 },
		)
	}
}
