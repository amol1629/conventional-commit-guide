import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

// Helper function to get display icon for activity type
const getActivityDisplayIcon = (activityType: string) => {
	switch (activityType) {
		case 'module_start':
		case 'module_complete':
		case 'module_progress':
			return 'Book'
		case 'commit_practice':
			return 'Play'
		case 'practice_session':
			return 'Code'
		case 'profile_update':
			return 'User'
		case 'page_visit':
			return 'Eye'
		case 'login':
			return 'SignIn'
		case 'logout':
			return 'SignOut'
		default:
			return 'Activity'
	}
}

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

		// Get comprehensive user stats
		const userStats = await databaseService.getUserStats(userId)
		const recentActivities = await databaseService.getUserActivities(userId, 5)

		// Also get module progress for recent activities
		const moduleProgress = await databaseService.getAllModuleProgress(userId)

		// Filter activities to only include learning-related activities (no page visits)
		const learningActivities = recentActivities.filter(
			(activity) =>
				activity.activityType === 'module_start' ||
				activity.activityType === 'module_complete' ||
				activity.activityType === 'module_progress' ||
				activity.activityType === 'commit_practice' ||
				activity.activityType === 'practice_session',
		)

		// Combine learning activities and module progress for a complete view
		const allRecentActivities = [
			...learningActivities.map((activity) => ({
				...activity,
				type: 'activity',
				displayTitle:
					activity.moduleTitle ||
					activity.activityType
						.replace('_', ' ')
						.replace(/\b\w/g, (l: string) => l.toUpperCase()),
				displayIcon: getActivityDisplayIcon(activity.activityType),
			})),
			...moduleProgress.slice(0, 5).map((progress) => ({
				...progress,
				type: 'module',
				displayTitle: progress.moduleTitle,
				displayIcon: 'Book',
				activityType: progress.completed
					? 'module_complete'
					: 'module_progress',
				timestamp: progress.lastAccessed,
			})),
		]
			.sort(
				(a, b) => {
					const aTime = 'timestamp' in a ? new Date(a.timestamp).getTime() : 0
					const bTime = 'timestamp' in b ? new Date(b.timestamp).getTime() : 0
					return bTime - aTime
				},
			)
			.slice(0, 5)

		return NextResponse.json({
			success: true,
			data: {
				stats: userStats,
				recentActivities: allRecentActivities,
			},
		})
	} catch (error) {
		console.error('Error fetching user stats:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
