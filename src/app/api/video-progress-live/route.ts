import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const {
			userId,
			videoId,
			moduleId,
			videoTitle,
			currentTime,
			duration,
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

		// Calculate progress percentage
		const progressPercentage = Math.round((currentTime / duration) * 100)

		// Update or create video progress
		const progressData = {
			userId,
			videoId,
			moduleId,
			videoTitle,
			currentTime,
			duration,
			progress: progressPercentage,
			lastAction: action,
			lastWatched: new Date(),
			completed: progressPercentage >= 95,
			metadata: {
				...metadata,
				ip: request.headers.get('x-forwarded-for') || 'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
				lastUpdate: new Date().toISOString(),
			},
		}

		await userVideoProgress.replaceOne({ userId, videoId }, progressData, {
			upsert: true,
		})

		// Track in learning history for significant events
		if (
			action === 'play' ||
			action === 'pause' ||
			action === 'complete' ||
			progressPercentage % 10 === 0
		) {
			await fetch('/api/learning-history', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId,
					activityType: `video_${action}`,
					moduleId,
					moduleTitle: videoTitle,
					progress: progressPercentage,
					timeSpent: Math.round(currentTime / 60),
					metadata: {
						...metadata,
						videoId,
						action,
						currentTime,
						duration,
						progressPercentage,
						timestamp: new Date().toISOString(),
					},
				}),
			})
		}

		return NextResponse.json({
			success: true,
			data: {
				progress: progressPercentage,
				currentTime,
				duration,
				completed: progressPercentage >= 95,
				formattedTime: formatTime(currentTime),
				formattedDuration: formatTime(duration),
			},
		})
	} catch (error) {
		console.error('Error updating live video progress:', error)
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

		if (!userId || !videoId) {
			return NextResponse.json(
				{ success: false, error: 'User ID and video ID are required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const userVideoProgress = db.collection('userVideoProgress')

		const progress = await userVideoProgress.findOne({ userId, videoId })

		if (!progress) {
			return NextResponse.json({
				success: true,
				data: {
					progress: 0,
					currentTime: 0,
					duration: 0,
					completed: false,
					formattedTime: '0:00',
					formattedDuration: '0:00',
				},
			})
		}

		return NextResponse.json({
			success: true,
			data: {
				progress: progress.progress || 0,
				currentTime: progress.currentTime || 0,
				duration: progress.duration || 0,
				completed: progress.completed || false,
				formattedTime: formatTime(progress.currentTime || 0),
				formattedDuration: formatTime(progress.duration || 0),
				lastWatched: progress.lastWatched,
			},
		})
	} catch (error) {
		console.error('Error fetching live video progress:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

function formatTime(seconds: number): string {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds % 3600) / 60)
	const secs = Math.floor(seconds % 60)

	if (hours > 0) {
		return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
			.toString()
			.padStart(2, '0')}`
	}
	return `${minutes}:${secs.toString().padStart(2, '0')}`
}
