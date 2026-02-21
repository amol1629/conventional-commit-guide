import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			videoId,
			moduleId,
			moduleTitle,
			action,
			progress,
			currentTime,
			duration,
			playbackRate,
			volume,
			quality,
			metadata,
		} = await request.json()

		if (!userId || !videoId || !moduleId || !action) {
			return NextResponse.json(
				{
					success: false,
					error: 'User ID, video ID, module ID, and action are required',
				},
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const videoTracking = db.collection('lmsVideoTracking')

		// Create comprehensive video tracking entry
		const trackingEntry = {
			userId,
			videoId,
			moduleId,
			moduleTitle: moduleTitle || '',
			action, // play, pause, seek, complete, progress, etc.
			progress: progress || 0, // percentage watched
			currentTime: currentTime || 0, // current position in seconds
			duration: duration || 0, // total video duration
			playbackRate: playbackRate || 1.0,
			volume: volume || 1.0,
			quality: quality || 'auto',
			timestamp: new Date(),
			metadata: {
				...metadata,
				ip:
					request.headers.get('x-forwarded-for') ||
					request.headers.get('x-real-ip') ||
					'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
				sessionId:
					request.headers.get('x-session-id') || `session_${Date.now()}`,
			},
		}

		await videoTracking.insertOne(trackingEntry)

		// Update user's video progress
		const userVideoProgress = db.collection('userVideoProgress')
		await userVideoProgress.updateOne(
			{ userId, videoId },
			{
				$set: {
					userId,
					videoId,
					moduleId,
					moduleTitle: moduleTitle || '',
					progress: progress || 0,
					currentTime: currentTime || 0,
					duration: duration || 0,
					lastAction: action,
					lastWatched: new Date(),
					playbackRate: playbackRate || 1.0,
					volume: volume || 1.0,
					quality: quality || 'auto',
					completed: action === 'complete' || (progress && progress >= 95),
					metadata: {
						...metadata,
						totalWatches: 1, // This will be incremented
					},
				},
				$inc: {
					totalWatches: action === 'play' ? 1 : 0,
					totalTimeWatched: currentTime || 0,
				},
			},
			{ upsert: true },
		)

		// Track in learning history
		await fetch('/api/learning-history', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				activityType: `video_${action}`,
				moduleId,
				moduleTitle,
				progress,
				timeSpent: Math.round((currentTime || 0) / 60), // convert to minutes
				metadata: {
					...metadata,
					videoId,
					action,
					currentTime,
					duration,
					playbackRate,
					quality,
					timestamp: new Date().toISOString(),
				},
			}),
		})

		return NextResponse.json({
			success: true,
			data: trackingEntry,
		})
	} catch (error) {
		console.error('Error tracking LMS video:', error)
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
		const videoId = searchParams.get('videoId')
		const moduleId = searchParams.get('moduleId')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const videoTracking = db.collection('lmsVideoTracking')

		const query: Record<string, unknown> = { userId }
		if (videoId) query.videoId = videoId
		if (moduleId) query.moduleId = moduleId

		const trackingData = await videoTracking
			.find(query)
			.sort({ timestamp: -1 })
			.limit(100)
			.toArray()

		// Get video progress summary
		const userVideoProgress = db.collection('userVideoProgress')
		const progressData = await userVideoProgress
			.find({
				userId,
				...(videoId ? { videoId } : {}),
				...(moduleId ? { moduleId } : {}),
			})
			.toArray()

		return NextResponse.json({
			success: true,
			data: {
				trackingData,
				progressData,
			},
		})
	} catch (error) {
		console.error('Error fetching LMS video tracking:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
