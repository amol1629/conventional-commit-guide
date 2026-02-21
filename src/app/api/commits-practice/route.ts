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
		const commitsPractice = db.collection('commitsPractice')

		const practiceSessions = await commitsPractice
			.find({ userId })
			.sort({ timestamp: -1 })
			.limit(limit)
			.toArray()

		// Get total practice count
		const totalPracticeCount = await commitsPractice.countDocuments({ userId })
		const successfulPracticeCount = await commitsPractice.countDocuments({
			userId,
			success: true,
		})

		return NextResponse.json({
			success: true,
			data: {
				practiceSessions,
				totalPracticeCount,
				successfulPracticeCount,
				successRate:
					totalPracticeCount > 0
						? Math.round((successfulPracticeCount / totalPracticeCount) * 100)
						: 0,
			},
		})
	} catch (error) {
		console.error('Error fetching commits practice:', error)
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
			moduleId,
			moduleTitle,
			commitMessage,
			expectedType,
			actualType,
			success,
			timeSpent,
			attempts,
			metadata,
		} = await request.json()

		if (!userId || !moduleId || !moduleTitle) {
			return NextResponse.json(
				{
					success: false,
					error: 'User ID, module ID, and module title are required',
				},
				{ status: 400 },
			)
		}

		const db = await getDatabase()
		const commitsPractice = db.collection('commitsPractice')

		const practiceSession = {
			userId,
			moduleId,
			moduleTitle,
			commitMessage: commitMessage || '',
			expectedType: expectedType || '',
			actualType: actualType || '',
			success: success || false,
			timeSpent: timeSpent || 0,
			attempts: attempts || 1,
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

		await commitsPractice.insertOne(practiceSession)

		// Update learning stats
		const learningStats = db.collection('learningStats')
		await learningStats.updateOne(
			{ userId },
			{
				$inc: {
					totalCommitsPracticed: 1,
					successfulCommitsPracticed: success ? 1 : 0,
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
			data: practiceSession,
		})
	} catch (error) {
		console.error('Error creating commits practice session:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
