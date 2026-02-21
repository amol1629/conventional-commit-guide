import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const moduleId = searchParams.get('moduleId')
		const videoId = searchParams.get('videoId')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()

		// Get user's learning progress
		const userProgress = db.collection('userVideoProgress')
		const progressQuery: Record<string, unknown> = { userId }
		if (moduleId) progressQuery.moduleId = moduleId
		if (videoId) progressQuery.videoId = videoId

		const progressData = await userProgress.find(progressQuery).toArray()

		// Get learning history for this user
		const learningHistory = db.collection('learningHistory')
		const historyQuery: Record<string, unknown> = { userId }
		if (moduleId) historyQuery.moduleId = moduleId

		const historyData = await learningHistory
			.find(historyQuery)
			.sort({ timestamp: -1 })
			.limit(50)
			.toArray()

		// Get bookmarks
		const bookmarks = db.collection('userBookmarks')
		const bookmarkData = await bookmarks
			.find({ userId, ...(moduleId ? { moduleId } : {}) })
			.sort({ createdAt: -1 })
			.toArray()

		// Get notes
		const notes = db.collection('userNotes')
		const noteData = await notes
			.find({ userId, ...(moduleId ? { moduleId } : {}) })
			.sort({ createdAt: -1 })
			.toArray()

		// Get learning sessions
		const learningSessions = db.collection('learningSessions')
		const sessionData = await learningSessions
			.find({ userId, ...(moduleId ? { moduleId } : {}) })
			.sort({ startTime: -1 })
			.limit(10)
			.toArray()

		// Calculate statistics
		const totalVideosWatched = await userProgress.countDocuments({
			userId,
			completed: true,
		})
		const totalTimeSpent = await userProgress
			.aggregate([
				{ $match: { userId } },
				{ $group: { _id: null, totalTime: { $sum: '$totalTimeWatched' } } },
			])
			.toArray()

		const currentStreak = await learningSessions
			.aggregate([
				{ $match: { userId } },
				{
					$group: {
						_id: { $dateToString: { format: '%Y-%m-%d', date: '$startTime' } },
					},
				},
				{ $sort: { _id: -1 } },
				{ $limit: 7 },
			])
			.toArray()

		return NextResponse.json({
			success: true,
			data: {
				progress: progressData,
				history: historyData,
				bookmarks: bookmarkData,
				notes: noteData,
				sessions: sessionData,
				statistics: {
					totalVideosWatched,
					totalTimeSpent: totalTimeSpent[0]?.totalTime || 0,
					currentStreak: currentStreak.length,
					totalBookmarks: bookmarkData.length,
					totalNotes: noteData.length,
				},
			},
		})
	} catch (error) {
		console.error('Error fetching Team Training CMS data:', error)
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
			action,
			moduleId,
			videoId,
			videoTitle,
			progress,
			currentTime,
			duration,
			metadata,
		} = await request.json()

		if (!userId || !action) {
			return NextResponse.json(
				{ success: false, error: 'User ID and action are required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()

		// Handle different actions
		switch (action) {
			case 'bookmark':
				const bookmarks = db.collection('userBookmarks')
				await bookmarks.insertOne({
					userId,
					moduleId,
					videoId,
					videoTitle,
					bookmarkTime: currentTime || 0,
					createdAt: new Date(),
					metadata: {
						...metadata,
						ip: request.headers.get('x-forwarded-for') || 'unknown',
						userAgent: request.headers.get('user-agent') || 'unknown',
					},
				})
				break

			case 'note':
				const notes = db.collection('userNotes')
				await notes.insertOne({
					userId,
					moduleId,
					videoId,
					videoTitle,
					noteTime: currentTime || 0,
					note: metadata?.note || '',
					createdAt: new Date(),
					metadata: {
						...metadata,
						ip: request.headers.get('x-forwarded-for') || 'unknown',
						userAgent: request.headers.get('user-agent') || 'unknown',
					},
				})
				break

			case 'update_progress':
				const userProgress = db.collection('userVideoProgress')
				await userProgress.updateOne(
					{ userId, videoId },
					{
						$set: {
							userId,
							videoId,
							moduleId,
							videoTitle,
							progress: progress || 0,
							currentTime: currentTime || 0,
							duration: duration || 0,
							lastWatched: new Date(),
							completed: progress >= 95,
						},
						$inc: {
							totalTimeWatched:
								(currentTime || 0) - (metadata?.previousTime || 0),
						},
					},
					{ upsert: true },
				)
				break

			case 'start_session':
				const learningSessions = db.collection('learningSessions')
				const sessionId = `session_${Date.now()}_${userId}`
				await learningSessions.insertOne({
					userId,
					sessionId,
					moduleId,
					moduleTitle: videoTitle,
					startTime: new Date(),
					activities: [],
					metadata: {
						...metadata,
						ip: request.headers.get('x-forwarded-for') || 'unknown',
						userAgent: request.headers.get('user-agent') || 'unknown',
					},
				})
				break

			case 'end_session':
				const sessions = db.collection('learningSessions')
				await sessions.updateOne(
					{ userId, sessionId: metadata?.sessionId },
					{
						$set: {
							endTime: new Date(),
							duration: Date.now() - new Date(metadata?.startTime).getTime(),
							activities: metadata?.activities || [],
						},
					},
				)
				break
		}

		// Track in learning history
		await fetch('/api/learning-history', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				userId,
				activityType: `cms_${action}`,
				moduleId,
				moduleTitle: videoTitle,
				progress,
				timeSpent: Math.round((currentTime || 0) / 60),
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
			message: `${action} recorded successfully`,
		})
	} catch (error) {
		console.error('Error processing Team Training CMS action:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
