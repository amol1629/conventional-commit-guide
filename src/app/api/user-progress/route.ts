import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		// Get user's module progress
		const moduleProgress = await databaseService.getAllModuleProgress(userId)

		// Find the most recent incomplete module
		const incompleteModules = moduleProgress.filter(
			(progress) => !progress.completed && progress.progress > 0,
		)
		const lastModule = incompleteModules.sort(
			(a, b) =>
				new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime(),
		)[0]

		// Get recent activities to find last learning activity
		const recentActivities = await databaseService.getUserActivities(userId, 10)
		const lastLearningActivity = recentActivities.find(
			(activity) =>
				activity.activityType === 'module_start' ||
				activity.activityType === 'module_progress' ||
				activity.activityType === 'practice_session',
		)

		return NextResponse.json({
			success: true,
			data: {
				lastModule,
				lastLearningActivity,
				allProgress: moduleProgress,
			},
		})
	} catch (error) {
		console.error('Error fetching user progress:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
