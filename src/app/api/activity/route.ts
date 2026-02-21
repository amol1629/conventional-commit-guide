import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { userId, activityType, moduleId, moduleTitle, progress, timeSpent } =
			await request.json()

		if (!userId || !activityType) {
			return NextResponse.json(
				{ success: false, error: 'User ID and activity type are required' },
				{ status: 400 },
			)
		}

		// Create activity record
		const activity = {
			userId,
			activityType, // 'module_start', 'module_complete', 'practice_session', 'commit_practice'
			moduleId: moduleId || null,
			moduleTitle: moduleTitle || null,
			progress: progress || 0,
			timeSpent: timeSpent || 0,
			timestamp: new Date(),
			metadata: {
				ip:
					request.headers.get('x-forwarded-for') ||
					request.headers.get('x-real-ip') ||
					'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
			},
		}

		// Save activity to database
		const savedActivity = await databaseService.createActivity(activity)

		// Update user stats
		await databaseService.updateLearningStats(userId)

		return NextResponse.json({
			success: true,
			data: savedActivity,
		})
	} catch (error) {
		console.error('Error in activity API:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const limit = parseInt(searchParams.get('limit') || '10')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		// Get recent activities
		const activities = await databaseService.getUserActivities(userId, limit)

		return NextResponse.json({
			success: true,
			data: activities,
		})
	} catch (error) {
		console.error('Error fetching activities:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
