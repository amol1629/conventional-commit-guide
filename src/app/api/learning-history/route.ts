import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const limit = parseInt(searchParams.get('limit') || '20')
		const activityType = searchParams.get('activityType')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		// Get comprehensive learning history
		const learningHistory = await databaseService.getLearningHistory(
			userId,
			limit,
			activityType || undefined,
		)

		return NextResponse.json({
			success: true,
			data: learningHistory,
		})
	} catch (error) {
		console.error('Error fetching learning history:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

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

		// Create detailed learning history entry
		const historyEntry = {
			userId,
			activityType,
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
				sessionId: request.headers.get('x-session-id') || 'unknown',
			},
		}

		// Save to learning history
		const savedEntry = await databaseService.createLearningHistoryEntry(
			historyEntry,
		)

		// Update module progress if applicable
		if (
			moduleId &&
			moduleTitle &&
			['module_start', 'module_progress', 'module_complete'].includes(
				activityType,
			)
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
			data: savedEntry,
		})
	} catch (error) {
		console.error('Error creating learning history entry:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
