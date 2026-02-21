import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { userId } = await request.json()

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		// Create sample videos
		const sampleVideos = [
			{
				videoId: 'git-basics-001',
				title: 'Git Fundamentals: Getting Started',
				description: 'Learn the basics of Git version control system',
				channelTitle: 'GitHub Academy',
				viewCount: 125000,
				publishedAt: '2023-01-15T00:00:00Z',
				duration: 1800, // 30 minutes
				moduleId: 'git-basics',
				category: 'tutorial',
				thumbnail:
					'https://img.youtube.com/vi/git-basics-001/maxresdefault.jpg',
				tags: ['git', 'basics', 'version-control'],
			},
			{
				videoId: 'commit-messages-001',
				title: 'Writing Perfect Commit Messages',
				description:
					'Master the art of writing clear and conventional commit messages',
				channelTitle: 'DevOps Academy',
				viewCount: 89000,
				publishedAt: '2023-02-20T00:00:00Z',
				duration: 1200, // 20 minutes
				moduleId: 'commit-messages',
				category: 'tutorial',
				thumbnail:
					'https://img.youtube.com/vi/commit-messages-001/maxresdefault.jpg',
				tags: ['commits', 'conventional', 'git'],
			},
			{
				videoId: 'team-workflow-001',
				title: 'Git Workflow for Teams',
				description: 'Learn professional Git workflows for team collaboration',
				channelTitle: 'Team Training',
				viewCount: 156000,
				publishedAt: '2023-03-10T00:00:00Z',
				duration: 2400, // 40 minutes
				moduleId: 'git-workflow',
				category: 'workflow',
				thumbnail:
					'https://img.youtube.com/vi/team-workflow-001/maxresdefault.jpg',
				tags: ['workflow', 'team', 'collaboration'],
			},
		]

		// Insert sample videos
		for (const video of sampleVideos) {
			await databaseService.createVideo(video)
		}

		// Create sample learning history entries
		const sampleHistory = [
			{
				userId,
				activityType: 'module_selected',
				moduleId: 'git-basics',
				moduleTitle: 'Git Basics',
				progress: 0,
				timeSpent: 0,
				timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
				metadata: {
					selectionTime: new Date(
						Date.now() - 2 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
			},
			{
				userId,
				activityType: 'video_selected',
				moduleId: 'git-basics',
				moduleTitle: 'Git Basics',
				progress: 0,
				timeSpent: 0,
				timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
				metadata: {
					videoId: 'git-basics-001',
					videoTitle: 'Git Fundamentals: Getting Started',
					selectionTime: new Date(
						Date.now() - 2 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
			},
			{
				userId,
				activityType: 'video_completed',
				moduleId: 'git-basics',
				moduleTitle: 'Git Basics',
				progress: 100,
				timeSpent: 30,
				timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
				metadata: {
					videoId: 'git-basics-001',
					videoTitle: 'Git Fundamentals: Getting Started',
					completionTime: new Date(
						Date.now() - 1 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
			},
			{
				userId,
				activityType: 'module_completed',
				moduleId: 'git-basics',
				moduleTitle: 'Git Basics',
				progress: 100,
				timeSpent: 30,
				timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
				metadata: {
					completionTime: new Date(
						Date.now() - 1 * 24 * 60 * 60 * 1000,
					).toISOString(),
				},
			},
			{
				userId,
				activityType: 'commit_practice',
				moduleId: 'interactive-practice',
				moduleTitle: 'Interactive Practice',
				progress: 100,
				timeSpent: 5,
				timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
				metadata: {
					commitMessage: 'feat(auth): add user authentication system',
					success: true,
					attempts: 1,
					perfect: true,
				},
			},
		]

		// Insert sample learning history
		for (const entry of sampleHistory) {
			await databaseService.createLearningHistoryEntry(entry)
		}

		// Create sample commits practice sessions
		const sampleCommitsPractice = [
			{
				userId,
				moduleId: 'interactive-practice',
				moduleTitle: 'Interactive Practice',
				commitMessage: 'feat(auth): add user authentication system',
				expectedType: 'feat',
				actualType: 'feat',
				success: true,
				timeSpent: 5,
				attempts: 1,
				metadata: {
					scenarioTitle: 'Authentication System',
					perfect: true,
					timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
				},
			},
			{
				userId,
				moduleId: 'interactive-practice',
				moduleTitle: 'Interactive Practice',
				commitMessage: 'fix(ui): resolve button alignment issue',
				expectedType: 'fix',
				actualType: 'fix',
				success: true,
				timeSpent: 3,
				attempts: 1,
				metadata: {
					scenarioTitle: 'UI Bug Fix',
					perfect: true,
					timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
				},
			},
			{
				userId,
				moduleId: 'interactive-practice',
				moduleTitle: 'Interactive Practice',
				commitMessage: 'docs: update API documentation',
				expectedType: 'docs',
				actualType: 'docs',
				success: true,
				timeSpent: 2,
				attempts: 1,
				metadata: {
					scenarioTitle: 'Documentation Update',
					perfect: true,
					timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
				},
			},
		]

		// Insert sample commits practice
		for (const practice of sampleCommitsPractice) {
			await databaseService.createCommitsPractice(practice)
		}

		// Create sample learning sessions
		const sampleSessions = [
			{
				userId,
				sessionId: `session_${Date.now() - 2 * 24 * 60 * 60 * 1000}`,
				moduleId: 'git-basics',
				moduleTitle: 'Git Basics',
				startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
				endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
				duration: 30,
				activities: [
					'module_selected',
					'video_selected',
					'video_completed',
					'module_completed',
				],
				metadata: {
					sessionType: 'learning',
					completionRate: 100,
				},
			},
			{
				userId,
				sessionId: `session_${Date.now() - 6 * 60 * 60 * 1000}`,
				moduleId: 'interactive-practice',
				moduleTitle: 'Interactive Practice',
				startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
				endTime: new Date(Date.now() - 5 * 60 * 60 * 1000),
				duration: 10,
				activities: ['commit_practice', 'commit_practice', 'commit_practice'],
				metadata: {
					sessionType: 'practice',
					completionRate: 100,
				},
			},
		]

		// Insert sample learning sessions
		for (const session of sampleSessions) {
			await databaseService.createLearningSession(session)
		}

		return NextResponse.json({
			success: true,
			message: 'Sample data created successfully',
			data: {
				videos: sampleVideos.length,
				historyEntries: sampleHistory.length,
				commitsPractice: sampleCommitsPractice.length,
				learningSessions: sampleSessions.length,
			},
		})
	} catch (error) {
		console.error('Error creating sample data:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
