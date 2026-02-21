import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData()
		const userId = formData.get('userId') as string
		const file = formData.get('photo') as File

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		if (!file) {
			return NextResponse.json(
				{ success: false, error: 'Photo file is required' },
				{ status: 400 },
			)
		}

		// Validate file type
		const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
		if (!allowedTypes.includes(file.type)) {
			return NextResponse.json(
				{
					success: false,
					error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.',
				},
				{ status: 400 },
			)
		}

		// Validate file size (max 5MB)
		const maxSize = 5 * 1024 * 1024 // 5MB
		if (file.size > maxSize) {
			return NextResponse.json(
				{ success: false, error: 'File size too large. Maximum size is 5MB.' },
				{ status: 400 },
			)
		}

		// Check if user exists
		const existingUser = await databaseService.getUserById(userId)
		if (!existingUser) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 },
			)
		}

		// Convert file to base64 for storage (in production, use cloud storage like AWS S3, Cloudinary, etc.)
		const bytes = await file.arrayBuffer()
		const buffer = Buffer.from(bytes)
		const base64 = buffer.toString('base64')
		const dataUrl = `data:${file.type};base64,${base64}`

		// Update user's avatar in database
		const updatedUser = await databaseService.updateUserAvatar(userId, dataUrl)

		return NextResponse.json({
			success: true,
			data: updatedUser,
			message: 'Profile photo updated successfully',
		})
	} catch (error) {
		console.error('Error uploading profile photo:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
