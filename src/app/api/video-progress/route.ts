import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			videoId,
			moduleId,
			moduleTitle,
			progress,
			timeSpent,
			action,
			metadata,
		} = await request.json()

		if (!userId || !videoId || !moduleId) {
			return NextResponse.json(
				{
					success: false,
					error: 'User ID, video ID, and module ID are required',
				},
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const userVideoProgress = db.collection('userVideoProgress')

		// Update or create video progress
		const progressData = {
			userId,
			videoId,
			moduleId,
			moduleTitle: moduleTitle || '',
			progress: progress || 0,
			timeSpent: timeSpent || 0,
			action: action || 'watch',
			lastWatched: new Date(),
			metadata: {
				...metadata,
				ip:
					request.headers.get('x-forwarded-for') ||
					request.headers.get('x-real-ip') ||
					'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
			},
			updatedAt: new Date(),
		}

		await userVideoProgress.replaceOne({ userId, videoId }, progressData, {
			upsert: true,
		})

		// Track in learning history
		await fetch('/api/learning-history', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				activityType:
					action === 'complete' ? 'video_completed' : 'video_progress',
				moduleId,
				moduleTitle,
				progress,
				timeSpent,
				metadata: {
					...metadata,
					videoId,
					action,
					timestamp: new Date().toISOString(),
				},
			}),
		})

		return NextResponse.json({
			success: true,
			data: progressData,
		})
	} catch (error) {
		console.error('Error tracking video progress:', error)
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
		const moduleId = searchParams.get('moduleId')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const userVideoProgress = db.collection('userVideoProgress')

		const query: Record<string, unknown> = { userId }
		if (moduleId) query.moduleId = moduleId

		const progress = await userVideoProgress
			.find(query)
			.sort({ lastWatched: -1 })
			.toArray()

		return NextResponse.json({
			success: true,
			data: progress,
		})
	} catch (error) {
		console.error('Error fetching video progress:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
