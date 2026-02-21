import { databaseService } from '@/services/database.service'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
	try {
		const { userId, name, email } = await request.json()

		if (!userId) {
			return NextResponse.json(
				{ success: false, error: 'User ID is required' },
				{ status: 400 },
			)
		}

		if (!name || !email) {
			return NextResponse.json(
				{ success: false, error: 'Name and email are required' },
				{ status: 400 },
			)
		}

		// Validate email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(email)) {
			return NextResponse.json(
				{ success: false, error: 'Invalid email format' },
				{ status: 400 },
			)
		}

		// Check if user exists - userId is actually the MongoDB _id
		const existingUser = await databaseService.getUserById(userId)
		if (!existingUser) {
			return NextResponse.json(
				{ success: false, error: 'User not found' },
				{ status: 404 },
			)
		}

		// Check if email is already taken by another user
		if (email !== existingUser.email) {
			const userWithEmail = await databaseService.getUser(email)
			if (userWithEmail && userWithEmail._id !== userId) {
				return NextResponse.json(
					{ success: false, error: 'Email is already taken' },
					{ status: 409 },
				)
			}
		}

		// Update user profile
		const updatedUser = await databaseService.updateUserProfile(userId, {
			name,
			email,
		})

		return NextResponse.json({
			success: true,
			data: updatedUser,
			message: 'Profile updated successfully',
		})
	} catch (error) {
		console.error('Error updating user profile:', error)
		return NextResponse.json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
