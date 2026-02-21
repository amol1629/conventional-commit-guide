import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const moduleId = searchParams.get('moduleId')
		const category = searchParams.get('category')
		const limit = parseInt(searchParams.get('limit') || '50')

		const db = await getDatabase()
		const videos = db.collection('videos')

		const query: Record<string, unknown> = {}
		if (moduleId) query.moduleId = moduleId
		if (category) query.category = category

		const videoList = await videos
			.find(query)
			.sort({ publishedAt: -1 })
			.limit(limit)
			.toArray()

		return NextResponse.json({
			success: true,
			data: videoList,
		})
	} catch (error) {
		console.error('Error fetching videos:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function POST(request: NextRequest) {
	try {
		const {
			videoId,
			title,
			description,
			channelTitle,
			viewCount,
			publishedAt,
			duration,
			moduleId,
			category,
			thumbnail,
			tags,
		} = await request.json()

		if (!videoId || !title || !moduleId) {
			return NextResponse.json(
				{
					success: false,
					error: 'Video ID, title, and module ID are required',
				},
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const videos = db.collection('videos')

		const video = {
			videoId,
			title,
			description: description || '',
			channelTitle: channelTitle || '',
			viewCount: viewCount || 0,
			publishedAt: publishedAt || new Date().toISOString(),
			duration: duration || 0,
			moduleId,
			category: category || 'tutorial',
			thumbnail: thumbnail || '',
			tags: tags || [],
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await videos.replaceOne({ videoId }, video, { upsert: true })

		return NextResponse.json({
			success: true,
			data: video,
		})
	} catch (error) {
		console.error('Error creating/updating video:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
