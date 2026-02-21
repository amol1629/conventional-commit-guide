import { getDatabase } from '@/lib/mongodb'
import { NextRequest, NextResponse } from 'next/server'

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

		const db = await getDatabase()
		const learningSessions = db.collection('learningSessions')

		const sessions = await learningSessions
			.find({ userId })
			.sort({ startTime: -1 })
			.limit(limit)
			.toArray()

		// Calculate total learning time
		const totalLearningTime = await learningSessions
			.aggregate([
				{ $match: { userId } },
				{ $group: { _id: null, totalTime: { $sum: '$duration' } } },
			])
			.toArray()

		return NextResponse.json({
			success: true,
			data: {
				sessions,
				totalLearningTime: totalLearningTime[0]?.totalTime || 0,
			},
		})
	} catch (error) {
		console.error('Error fetching learning sessions:', error)
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
			sessionId,
			moduleId,
			moduleTitle,
			startTime,
			endTime,
			duration,
			activities,
			metadata,
		} = await request.json()

		if (!userId || !sessionId || !moduleId) {
			return NextResponse.json(
				{
					success: false,
					error: 'User ID, session ID, and module ID are required',
				},
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const learningSessions = db.collection('learningSessions')

		const session = {
			userId,
			sessionId,
			moduleId,
			moduleTitle: moduleTitle || '',
			startTime: startTime || new Date(),
			endTime: endTime || null,
			duration: duration || 0,
			activities: activities || [],
			metadata: {
				...metadata,
				ip:
					request.headers.get('x-forwarded-for') ||
					request.headers.get('x-real-ip') ||
					'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
			},
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await learningSessions.replaceOne({ sessionId }, session, { upsert: true })

		return NextResponse.json({
			success: true,
			data: session,
		})
	} catch (error) {
		console.error('Error creating learning session:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}

export async function PUT(request: NextRequest) {
	try {
		const { sessionId, endTime, duration, activities } = await request.json()

		if (!sessionId) {
			return NextResponse.json(
				{ success: false, error: 'Session ID is required' },
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const learningSessions = db.collection('learningSessions')

		const updateData: Record<string, unknown> = {
			updatedAt: new Date(),
		}

		if (endTime) updateData.endTime = endTime
		if (duration !== undefined) updateData.duration = duration
		if (activities) updateData.activities = activities

		await learningSessions.updateOne({ sessionId }, { $set: updateData })

		return NextResponse.json({
			success: true,
			message: 'Session updated successfully',
		})
	} catch (error) {
		console.error('Error updating learning session:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
