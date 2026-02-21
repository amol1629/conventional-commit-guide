'use client'

import Layout from '@/components/Layout'
import LearningDashboard from '@/components/LearningDashboard'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ProfilePhotoUpload } from '@/components/ProfilePhotoUpload'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { usePageTracker } from '@/hooks/usePageTracker'
import { trackProfileUpdate } from '@/utils/activity-tracker'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Image from 'next/image'
// import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
	const { authState, updateUser } = useAuth()
	// const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [name, setName] = useState(authState.user?.name || '')
	const [email, setEmail] = useState(authState.user?.email || '')
	const [isLoading, setIsLoading] = useState(false)
	const [userStats, setUserStats] = useState({
		modulesCompleted: 0,
		commitsPracticed: 0,
		streakDays: 0,
		achievementsCount: 0,
		learningProgress: 0,
		skillLevel: 'Beginner',
		timeInvested: 0, // in minutes
	})
	const [isLoadingStats, setIsLoadingStats] = useState(true)

	// Track page visits
	usePageTracker(authState.user?.id)

	// Load user stats on component mount
	useEffect(() => {
		const loadUserData = async () => {
			if (!authState.user?.id) return

			try {
				setIsLoadingStats(true)

				const response = await fetch(
					`/api/user-stats?userId=${authState.user.id}`,
				)
				const data = await response.json()

				if (data.success && data.data.stats) {
					setUserStats(data.data.stats)
				}
			} catch (error) {
				console.error('Error loading user data:', error)
			} finally {
				setIsLoadingStats(false)
			}
		}

		loadUserData()
	}, [authState.user?.id])

	const handleSave = async () => {
		setIsLoading(true)
		try {
			const response = await fetch('/api/user/update', {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: authState.user?.id,
					name,
					email,
				}),
			})

			const data = await response.json()

			if (data.success) {
				const updatedUser = {
					id: authState.user?.id || '',
					email: data.data.email,
					name: data.data.name,
					avatar: data.data.avatar,
				}
				updateUser(updatedUser)
				setIsEditing(false)

				// Track profile update activity
				if (authState.user?.id) {
					await trackProfileUpdate(authState.user.id)
				}

				toast.success('Profile updated successfully! ✨')
			} else {
				toast.error(data.error || 'Failed to update profile')
			}
		} catch {
			toast.error('Failed to update profile. Please try again.')
		} finally {
			setIsLoading(false)
		}
	}

	const handleCancel = () => {
		setName(authState.user?.name || '')
		setEmail(authState.user?.email || '')
		setIsEditing(false)
	}

	// Unused function - commented out to fix build errors

	// Unused function - commented out to fix build errors

	const formatTime = (minutes: number) => {
		if (minutes < 60) {
			return `${minutes}m`
		}
		const hours = Math.floor(minutes / 60)
		const remainingMinutes = minutes % 60
		return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
	}

	// Unused function - commented out to fix build errors

	return (
		<ProtectedRoute>
			<Layout>
				<div className="min-h-screen bg-gray-50">
					{/* Modern Header */}

					<div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
							{/* Main Content */}
							<div className="lg:col-span-2">
								{/* Profile Section */}
								<div className="mb-8">
									<h1 className="mb-2 text-3xl font-bold text-purple-800">
										PROFILE
									</h1>
									<p className="mb-6 text-gray-600">
										Welcome back to your home! Here to check your activity you
										done!
									</p>

									{/* Profile Card */}
									<Card className="overflow-hidden bg-white border-0 shadow-lg rounded-2xl">
										<CardContent className="p-6">
											<div className="flex items-start gap-6">
												{/* Profile Photo */}
												<div className="flex-shrink-0">
													<ProfilePhotoUpload
														userId={authState.user?.id || ''}
														currentAvatar={authState.user?.avatar}
														onPhotoUpdate={(newAvatar) => {
															updateUser({
																...authState.user!,
																avatar: newAvatar,
															})
														}}
														className="mb-4"
													/>
												</div>

												{/* Profile Details */}
												<div className="flex-1 space-y-4">
													<div className="space-y-3">
														<div>
															<Label className="text-sm font-medium text-gray-700">
																Full Name
															</Label>
															<Input
																value={name}
																onChange={(e) => setName(e.target.value)}
																disabled={!isEditing}
																className="h-10 mt-1 border-gray-200 rounded-xl"
															/>
														</div>
														<div>
															<Label className="text-sm font-medium text-gray-700">
																Email Address
															</Label>
															<Input
																value={email}
																onChange={(e) => setEmail(e.target.value)}
																disabled={!isEditing}
																className="h-10 mt-1 border-gray-200 rounded-xl"
															/>
														</div>
													</div>

													{/* Action Buttons */}
													<div className="flex gap-3 pt-4">
														{!isEditing ? (
															<Button
																onClick={() => setIsEditing(true)}
																className="px-6 py-2 font-medium text-white shadow-lg bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 rounded-xl"
															>
																Edit Profile
															</Button>
														) : (
															<>
																<Button
																	onClick={handleSave}
																	disabled={isLoading}
																	className="px-6 py-2 font-medium text-white shadow-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl"
																>
																	{isLoading ? (
																		<>
																			<LoadingSpinner
																				size="sm"
																				variant="dots"
																				className="mr-2"
																			/>
																			Saving...
																		</>
																	) : (
																		'Save Changes'
																	)}
																</Button>
																<Button
																	variant="outline"
																	onClick={handleCancel}
																	disabled={isLoading}
																	className="px-6 py-2 border-gray-200 rounded-xl"
																>
																	Cancel
																</Button>
															</>
														)}
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Learning Progress Cards */}
								<div className="mb-8">
									<h2 className="mb-4 text-2xl font-bold text-purple-800">
										Learning Progress
									</h2>
									<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
										{/* Git Basics Card */}
										<Card className="overflow-hidden text-white border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl">
											<CardContent className="p-6">
												<div className="flex items-center gap-4">
													<div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
														{getFontAwesomeIcon('Code', 'w-6 h-6')}
													</div>
													<div>
														<h3 className="text-lg font-bold">Git Basics</h3>
														<p className="text-sm opacity-90">
															Learn the fundamentals of Git version control.
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Commit Messages Card */}
										<Card className="overflow-hidden text-white border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl">
											<CardContent className="p-6">
												<div className="flex items-center gap-4">
													<div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
														{getFontAwesomeIcon('FileText', 'w-6 h-6')}
													</div>
													<div>
														<h3 className="text-lg font-bold">
															Commit Messages
														</h3>
														<p className="text-sm opacity-90">
															Master conventional commit message formats.
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Git Workflow Card */}
										<Card className="overflow-hidden text-white border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
											<CardContent className="p-6">
												<div className="flex items-center gap-4">
													<div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
														{getFontAwesomeIcon('GitBranch', 'w-6 h-6')}
													</div>
													<div>
														<h3 className="text-lg font-bold">Git Workflow</h3>
														<p className="text-sm opacity-90">
															Learn branching and merging strategies.
														</p>
													</div>
												</div>
											</CardContent>
										</Card>

										{/* Advanced Git Card */}
										<Card className="overflow-hidden text-white border-0 shadow-lg bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl">
											<CardContent className="p-6">
												<div className="flex items-center gap-4">
													<div className="flex items-center justify-center w-12 h-12 bg-white/20 rounded-xl">
														{getFontAwesomeIcon('Terminal', 'w-6 h-6')}
													</div>
													<div>
														<h3 className="text-lg font-bold">Advanced Git</h3>
														<p className="text-sm opacity-90">
															Master advanced Git commands and techniques.
														</p>
													</div>
												</div>
											</CardContent>
										</Card>
									</div>
								</div>

								{/* Learning Dashboard */}
								<div className="mb-8">
									<LearningDashboard userId={authState.user?.id || ''} />
								</div>
							</div>

							{/* Right Sidebar */}
							<div className="lg:col-span-1">
								{/* User Profile Card */}
								<Card className="mb-6 bg-white border-0 shadow-lg rounded-2xl">
									<CardContent className="p-6 text-center">
										<div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400 to-purple-600">
											{authState.user?.avatar &&
											authState.user.avatar.startsWith('data:') ? (
												<Image
													src={authState.user.avatar}
													alt="Profile"
													width={80}
													height={80}
													className="object-cover w-full h-full rounded-full"
												/>
											) : (
												<span className="text-2xl font-bold text-white">
													{authState.user?.name?.charAt(0) || 'U'}
												</span>
											)}
										</div>
										<h3 className="mb-1 text-xl font-bold text-gray-900">
											{authState.user?.name || 'User'}
										</h3>
										<p className="mb-6 text-sm text-gray-600">
											{authState.user?.email}
										</p>

										{/* Statistics Grid */}
										<div className="grid grid-cols-2 gap-4">
											<div className="text-center">
												<p className="text-2xl font-bold text-blue-600">
													{isLoadingStats ? '...' : userStats.modulesCompleted}
												</p>
												<p className="text-xs text-gray-500">
													Modules completed
												</p>
											</div>
											<div className="text-center">
												<p className="text-2xl font-bold text-purple-600">
													{isLoadingStats ? '...' : userStats.commitsPracticed}
												</p>
												<p className="text-xs text-gray-500">
													Commits practiced
												</p>
											</div>
											<div className="text-center">
												<p className="text-2xl font-bold text-pink-600">
													{isLoadingStats ? '...' : userStats.streakDays}
												</p>
												<p className="text-xs text-gray-500">Streak days</p>
											</div>
											<div className="text-center">
												<p className="text-2xl font-bold text-green-600">
													{isLoadingStats ? '...' : userStats.achievementsCount}
												</p>
												<p className="text-xs text-gray-500">Achievements</p>
											</div>
											<div className="col-span-2 text-center">
												<p className="text-2xl font-bold text-orange-600">
													{isLoadingStats
														? '...'
														: formatTime(userStats.timeInvested)}
												</p>
												<p className="text-xs text-gray-500">Time invested</p>
											</div>
										</div>
									</CardContent>
								</Card>

								{/* Learning Progress Card */}
								<Card className="mb-6 bg-white border-0 shadow-lg rounded-2xl">
									<CardContent className="p-6">
										<h3 className="mb-1 text-lg font-bold text-gray-900">
											Learning Progress
										</h3>
										<p className="mb-4 text-sm text-gray-600">
											Your overall learning completion
										</p>
										<div className="w-full h-3 bg-gray-200 rounded-full">
											<div
												className="h-3 bg-blue-500 rounded-full"
												style={{ width: `${userStats.learningProgress}%` }}
											></div>
										</div>
										<p className="mt-2 text-sm text-gray-600">
											{isLoadingStats
												? 'Loading...'
												: `${userStats.learningProgress}% Complete`}
										</p>
									</CardContent>
								</Card>

								{/* Skill Level Card */}
								<Card className="bg-white border-0 shadow-lg rounded-2xl">
									<CardContent className="p-6">
										<h3 className="mb-1 text-lg font-bold text-gray-900">
											Git Skill Level
										</h3>
										<p className="mb-4 text-sm text-gray-600">
											Your current Git expertise level
										</p>
										<div className="w-full h-3 bg-gray-200 rounded-full">
											<div
												className="h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-700"
												style={{
													width: `${Math.min(
														userStats.learningProgress * 1.25,
														100,
													)}%`,
												}}
											></div>
										</div>
										<p className="mt-2 text-sm text-gray-600">
											{isLoadingStats ? 'Loading...' : userStats.skillLevel}
										</p>
									</CardContent>
								</Card>
							</div>
						</div>
					</div>
				</div>
			</Layout>
		</ProtectedRoute>
	)
}
