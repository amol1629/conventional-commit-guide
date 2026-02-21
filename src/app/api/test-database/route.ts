import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url)
		const userId = searchParams.get('userId') || 'test-user-123'

		// Test all database operations
		const results = {
			learningHistory: await databaseService.getLearningHistory(userId, 10),
			commitsPractice: await databaseService.getCommitsPractice(userId, 10),
			learningSessions: await databaseService.getLearningSessions(userId, 5),
			videos: await databaseService.getVideos(undefined, undefined, 10),
		}

		return NextResponse.json({
			success: true,
			message: 'Database test completed successfully',
			data: {
				learningHistoryCount: results.learningHistory.length,
				commitsPracticeCount: results.commitsPractice.practiceSessions.length,
				learningSessionsCount: results.learningSessions.sessions.length,
				videosCount: results.videos.length,
				commitsPracticeStats: {
					totalPracticeCount: results.commitsPractice.totalPracticeCount,
					successfulPracticeCount:
						results.commitsPractice.successfulPracticeCount,
					successRate: results.commitsPractice.successRate,
				},
			},
		})
	} catch (error) {
		console.error('Error testing database:', error)
		return NextResponse.json(
			{ success: false, error: 'Database test failed' },
			{ status: 500 },
		)
	}
}
