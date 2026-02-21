import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const { userId, page, title, timeSpent } = await request.json()

		if (!userId || !page) {
			return NextResponse.json(
				{ success: false, error: 'User ID and page are required' },
				{ status: 400 },
			)
		}

		// Create page visit activity
		const visitActivity = {
			userId,
			activityType: 'page_visit',
			moduleId: null,
			moduleTitle: title || page,
			progress: 0,
			timeSpent: timeSpent || 0,
			timestamp: new Date(),
			metadata: {
				page,
				title: title || page,
				ip:
					request.headers.get('x-forwarded-for') ||
					request.headers.get('x-real-ip') ||
					'unknown',
				userAgent: request.headers.get('user-agent') || 'unknown',
			},
		}

		// Save page visit to database
		await databaseService.createActivity(visitActivity)

		return NextResponse.json({
			success: true,
			message: 'Page visit tracked successfully',
		})
	} catch (error) {
		console.error('Error tracking page visit:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
