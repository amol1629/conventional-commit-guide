import { databaseService } from '@/services/database.service'
import { NextResponse } from 'next/server'

export async function POST() {
	try {
		// Initialize default achievements
		await databaseService.initializeAchievements()

		return NextResponse.json({
			success: true,
			message: 'Database initialized successfully',
		})
	} catch (error) {
		console.error('Error initializing database:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to initialize database' },
			{ status: 500 },
		)
	}
}
