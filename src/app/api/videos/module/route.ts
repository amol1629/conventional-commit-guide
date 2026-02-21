import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const moduleId = searchParams.get('moduleId')
		const userId = searchParams.get('userId')

		if (!moduleId) {
			return NextResponse.json(
				{ success: false, error: 'Module ID is required' },
				{ status: 400 },
			)
		}

		// Get videos for the module
		const videos = await databaseService.getVideos(moduleId, undefined, 50)

		// Get user's video progress if userId is provided
		let userVideoProgress: Record<string, unknown>[] = []
		if (userId) {
			const { getDatabase } = await import('@/lib/mongodb')
			const db = await getDatabase()
			userVideoProgress = await db
				.collection('userVideoProgress')
				.find({ userId, moduleId })
				.toArray()
		}

		// Combine videos with user progress
		const videosWithProgress = videos.map((video) => {
			const progress = userVideoProgress.find(
				(p) => p.videoId === video.videoId,
			)
			return {
				...video,
				userProgress: progress || null,
			}
		})

		return NextResponse.json({
			success: true,
			data: videosWithProgress,
		})
	} catch (error) {
		console.error('Error fetching module videos:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
