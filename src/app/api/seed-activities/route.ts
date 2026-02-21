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

		// Create sample learning activities
		const sampleActivities = [
			{
				userId,
				activityType: 'module_start',
				moduleId: 'git-basics',
				moduleTitle: 'Git & GitHub Guide',
				progress: 0,
				timeSpent: 0,
				timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
			},
			{
				userId,
				activityType: 'commit_practice',
				moduleId: null,
				moduleTitle: 'Commit Message Practice',
				progress: 0,
				timeSpent: 15,
				timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
			},
			{
				userId,
				activityType: 'module_complete',
				moduleId: 'git-workflow',
				moduleTitle: 'Team Training',
				progress: 100,
				timeSpent: 45,
				timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
			},
			{
				userId,
				activityType: 'module_start',
				moduleId: 'commit-guide',
				moduleTitle: 'Master Conventional Commits',
				progress: 0,
				timeSpent: 0,
				timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
			},
		]

		// Insert sample activities
		for (const activity of sampleActivities) {
			await databaseService.createActivity(activity)
		}

		// Create corresponding module progress
		await databaseService.updateModuleProgress(
			userId,
			'git-basics',
			'Git & GitHub Guide',
			30,
			undefined,
			60,
		)

		await databaseService.updateModuleProgress(
			userId,
			'git-workflow',
			'Team Training',
			100,
			undefined,
			45,
		)

		await databaseService.updateModuleProgress(
			userId,
			'commit-guide',
			'Master Conventional Commits',
			15,
			undefined,
			10,
		)

		// Update learning stats
		await databaseService.updateLearningStats(userId)

		return NextResponse.json({
			success: true,
			message: 'Sample activities created successfully',
		})
	} catch (error) {
		console.error('Error creating sample activities:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
