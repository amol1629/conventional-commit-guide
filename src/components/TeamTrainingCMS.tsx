'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/contexts/AuthContext'
import {
	AcademicCapIcon,
	BookmarkIcon,
	ChartBarIcon,
	CheckCircleIcon,
	ClockIcon,
	PencilIcon,
	PlayIcon,
} from '@heroicons/react/24/outline'
import { useCallback, useEffect, useState } from 'react'

interface CMSData {
	progress: Record<string, unknown>[]
	history: Record<string, unknown>[]
	bookmarks: Record<string, unknown>[]
	notes: Record<string, unknown>[]
	sessions: Record<string, unknown>[]
	statistics: {
		totalVideosWatched: number
		totalTimeSpent: number
		currentStreak: number
		totalBookmarks: number
		totalNotes: number
	}
}

interface TeamTrainingCMSProps {
	moduleId?: string
}

export const TeamTrainingCMS = ({ moduleId }: TeamTrainingCMSProps) => {
	const { authState } = useAuth()
	const [cmsData, setCmsData] = useState<CMSData | null>(null)
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState('overview')

	const fetchCMSData = useCallback(async () => {
		try {
			const response = await fetch(
				`/api/team-training-cms?userId=${authState.user?.id}${
					moduleId ? `&moduleId=${moduleId}` : ''
				}`,
			)
			const data = await response.json()

			if (data.success) {
				setCmsData(data.data)
			}
		} catch (error) {
			console.error('Error fetching CMS data:', error)
		} finally {
			setLoading(false)
		}
	}, [authState.user?.id, moduleId])

	useEffect(() => {
		if (authState.user?.id) {
			fetchCMSData()
		}
	}, [authState.user?.id, moduleId, fetchCMSData])

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = Math.floor(seconds % 60)

		if (hours > 0) {
			return `${hours}h ${minutes}m ${secs}s`
		}
		return `${minutes}m ${secs}s`
	}

	const formatDate = (date: string | Date): string => {
		return new Date(date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	if (loading) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="flex items-center justify-center">
						<LoadingSpinner size="md" variant="default" />
						<span className="ml-2">Loading CMS data...</span>
					</div>
				</CardContent>
			</Card>
		)
	}

	if (!cmsData) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-gray-500">
						<AcademicCapIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
						<p>No learning data available yet.</p>
						<p className="text-sm">
							Start watching videos to see your progress here.
						</p>
					</div>
				</CardContent>
			</Card>
		)
	}

	return (
		<div className="space-y-6">
			{/* Statistics Overview */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Videos Watched
								</p>
								<p className="text-2xl font-bold text-purple-600">
									{cmsData.statistics.totalVideosWatched}
								</p>
							</div>
							<PlayIcon className="w-8 h-8 text-purple-400" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Time Spent</p>
								<p className="text-2xl font-bold text-blue-600">
									{formatTime(cmsData.statistics.totalTimeSpent)}
								</p>
							</div>
							<ClockIcon className="w-8 h-8 text-blue-400" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">
									Current Streak
								</p>
								<p className="text-2xl font-bold text-green-600">
									{cmsData.statistics.currentStreak} days
								</p>
							</div>
							<ChartBarIcon className="w-8 h-8 text-green-400" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="p-4">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-gray-600">Bookmarks</p>
								<p className="text-2xl font-bold text-orange-600">
									{cmsData.statistics.totalBookmarks}
								</p>
							</div>
							<BookmarkIcon className="w-8 h-8 text-orange-400" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Tabs */}
			<Tabs value={activeTab} onValueChange={setActiveTab}>
				<TabsList className="grid w-full grid-cols-4">
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="progress">Progress</TabsTrigger>
					<TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
					<TabsTrigger value="notes">Notes</TabsTrigger>
				</TabsList>

				<TabsContent value="overview" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{cmsData.history.slice(0, 5).map((activity, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
												<PlayIcon className="w-4 h-4 text-purple-600" />
											</div>
											<div>
												<p className="font-medium text-sm">
													{activity.moduleTitle as string}
												</p>
												<p className="text-xs text-gray-500">
													{(activity.activityType as string)
														.replace('_', ' ')
														.toUpperCase()}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-xs text-gray-500">
												{formatDate(activity.timestamp as string)}
											</p>
											{typeof activity.progress === 'number' && activity.progress > 0 && (
												<Badge variant="secondary" className="text-xs">
													{activity.progress}%
												</Badge>
											)}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="progress" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Video Progress</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{cmsData.progress.map((video, index) => (
									<div key={index} className="border rounded-lg p-4">
										<div className="flex items-center justify-between mb-2">
											<h3 className="font-medium">{video.videoTitle as string}</h3>
											<div className="flex items-center gap-2">
												{typeof video.completed === 'boolean' && video.completed && (
													<Badge
														variant="default"
														className="bg-green-100 text-green-800"
													>
														<CheckCircleIcon className="w-3 h-3 mr-1" />
														Completed
													</Badge>
												)}
												<Badge variant="secondary">{video.progress as number}%</Badge>
											</div>
										</div>
										<Progress value={video.progress as number} className="mb-2" />
										<div className="flex items-center justify-between text-sm text-gray-500">
											<span>Watched: {formatTime((video.currentTime as number) || 0)}</span>
											<span>Duration: {formatTime((video.duration as number) || 0)}</span>
											<span>Last watched: {formatDate(video.lastWatched as string)}</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="bookmarks" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Your Bookmarks</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{cmsData.bookmarks.map((bookmark, index) => (
									<div
										key={index}
										className="flex items-center justify-between p-3 bg-orange-50 rounded-lg"
									>
										<div className="flex items-center gap-3">
											<BookmarkIcon className="w-5 h-5 text-orange-600" />
											<div>
												<p className="font-medium text-sm">
													{bookmark.videoTitle as string}
												</p>
												<p className="text-xs text-gray-500">
													Bookmarked at {formatTime(bookmark.bookmarkTime as number)}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-xs text-gray-500">
												{formatDate(bookmark.createdAt as string)}
											</p>
											<Button size="sm" variant="outline">
												Go to Bookmark
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="notes" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Your Notes</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								{cmsData.notes.map((note, index) => (
									<div
										key={index}
										className="flex items-start justify-between p-3 bg-blue-50 rounded-lg"
									>
										<div className="flex items-start gap-3">
											<PencilIcon className="w-5 h-5 text-blue-600 mt-1" />
											<div className="flex-1">
												<p className="font-medium text-sm">{note.videoTitle as string}</p>
												<p className="text-sm text-gray-700 mt-1">
													{note.note as string}
												</p>
												<p className="text-xs text-gray-500 mt-1">
													Note at {formatTime(note.noteTime as number)}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p className="text-xs text-gray-500">
												{formatDate(note.createdAt as string)}
											</p>
											<Button size="sm" variant="outline">
												View Note
											</Button>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	)
}
