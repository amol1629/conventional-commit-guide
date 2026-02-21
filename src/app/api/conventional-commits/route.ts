import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId')
		const limit = parseInt(searchParams.get('limit') || '20')

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const conventionalCommits = db.collection('conventionalCommits')

		const activities = await conventionalCommits
			.find({ userId })
			.sort({ timestamp: -1 })
			.limit(limit)
			.toArray()

		// Get statistics
		const totalActivities = await conventionalCommits.countDocuments({ userId })
		const completedLessons = await conventionalCommits.countDocuments({
			userId,
			activityType: 'lesson_completed',
		})
		const practiceSessions = await conventionalCommits.countDocuments({
			userId,
			activityType: 'practice_session',
		})
		const totalTimeSpent = await conventionalCommits
			.aggregate([
				{ $match: { userId } },
				{ $group: { _id: null, totalTime: { $sum: '$timeSpent' } } },
			])
			.toArray()

		return NextResponse.json({
			success: true,
			data: {
				activities,
				statistics: {
					totalActivities,
					completedLessons,
					practiceSessions,
					totalTimeSpent: totalTimeSpent[0]?.totalTime || 0,
				},
			},
		})
	} catch (error) {
		console.error('Error fetching conventional commits activities:', error)
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
			lessonId,
			lessonTitle,
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

		const db = await getDatabase()
		const conventionalCommits = db.collection('conventionalCommits')

		const activity = {
			userId,
			activityType,
			lessonId: lessonId || null,
			lessonTitle: lessonTitle || null,
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

		await conventionalCommits.insertOne(activity)

		// Update learning stats
		const learningStats = db.collection('learningStats')
		await learningStats.updateOne(
			{ userId },
			{
				$inc: {
					totalTimeSpent: timeSpent || 0,
				},
				$set: {
					lastActivity: new Date(),
					updatedAt: new Date(),
				},
			},
			{ upsert: true },
		)

		return NextResponse.json({
			success: true,
			data: activity,
		})
	} catch (error) {
		console.error('Error creating conventional commits activity:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
