import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			activityType,
			moduleId,
			moduleTitle,
			progress,
			timeSpent,
			metadata,
		} = await request.json()

		if (!userId || !activityType) {
			return NextResponse.json(
				{ success: false, error: 'User ID and activity type are required' },
				{ status: 400 },
			)
		}

		// Create comprehensive activity record
		const activity = {
			userId,
			activityType, // 'module_start', 'module_progress', 'module_complete', 'practice_session', 'commit_practice', 'video_watch', 'quiz_complete'
			moduleId: moduleId || null,
			moduleTitle: moduleTitle || null,
			progress: progress || 0,
			timeSpent: timeSpent || 0,
			timestamp: new Date(),
			metadata: {
				...metadata,
				ip:
					request.headers.get('x-forwarded-for') ||
					request.headers.get('x-real-ip') ||
					'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
			},
		}

		// Save activity to database
		const savedActivity = await databaseService.createActivity(activity)

		// Update module progress if it's a learning activity
		if (
			moduleId &&
			moduleTitle &&
			(activityType === 'module_start' ||
				activityType === 'module_progress' ||
				activityType === 'module_complete')
		) {
			await databaseService.updateModuleProgress(
				userId,
				moduleId,
				moduleTitle,
				progress || 0,
				undefined,
				timeSpent || 0,
			)
		}

		// Update learning stats
		await databaseService.updateLearningStats(userId)

		return NextResponse.json({
			success: true,
			data: savedActivity,
		})
	} catch (error) {
		console.error('Error tracking learning activity:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
