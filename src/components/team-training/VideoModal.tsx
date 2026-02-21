'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { YouTubeVideo } from '@/services/youtube.service'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface VideoModalProps {
	isOpen: boolean
	onClose: () => void
	moduleTitle: string
	moduleDescription: string
	videos: YouTubeVideo[]
	onVideoSelect: (video: YouTubeVideo) => void
	selectedVideo?: YouTubeVideo
	progress?: number
	onProgressUpdate?: (progress: number) => void
}

interface VideoWatchTime {
	videoId: string
	watchedTime: number // in seconds
	totalTime: number // in seconds
	lastWatched: string
}

export default function VideoModal({
	isOpen,
	onClose,
	moduleTitle,
	moduleDescription,
	videos,
	onVideoSelect,
	selectedVideo,
	progress = 0,
	onProgressUpdate,
}: VideoModalProps) {
	const [localProgress, setLocalProgress] = useState(progress)
	const [isWatching, setIsWatching] = useState(false)
	const [videoWatchTimes, setVideoWatchTimes] = useState<VideoWatchTime[]>([])
	const [currentVideoTime, setCurrentVideoTime] = useState(0)
	const [isVideoPlaying, setIsVideoPlaying] = useState(false)
	const watchTimeRef = useRef<NodeJS.Timeout | null>(null)

	useEffect(() => {
		setLocalProgress(progress)
	}, [progress])

	// Parse duration string to seconds
	const parseDuration = (duration: string): number => {
		if (duration === 'Unknown' || !duration) return 0
		const parts = duration.split(':')
		if (parts.length === 2) {
			return parseInt(parts[0]) * 60 + parseInt(parts[1])
		} else if (parts.length === 3) {
			return (
				parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
			)
		}
		return 0
	}

	// Get total required watch time for all videos
	const getTotalRequiredTime = (): number => {
		return videos.reduce((total, video) => {
			return total + parseDuration(video.duration)
		}, 0)
	}

	// Get total watched time
	const getTotalWatchedTime = (): number => {
		return videoWatchTimes.reduce((total, watchTime) => {
			return total + watchTime.watchedTime
		}, 0)
	}

	// Calculate progress based on watch time - STRICT MODE
	const calculateProgressFromWatchTime = (): number => {
		const totalRequired = getTotalRequiredTime()
		const totalWatched = getTotalWatchedTime()
		if (totalRequired === 0) return 0

		// Only allow completion if user has watched at least 95% of total time
		const completionThreshold = 0.95
		const progressPercentage = totalWatched / totalRequired

		if (progressPercentage >= completionThreshold) {
			return 100 // Only allow 100% when threshold is met
		}

		// Cap progress at 95% until threshold is met
		return Math.min(95, Math.round(progressPercentage * 100))
	}

	// Start tracking video time
	const startVideoTracking = (video: YouTubeVideo) => {
		if (watchTimeRef.current) {
			clearInterval(watchTimeRef.current)
		}

		const videoId = video.id
		const totalTime = parseDuration(video.duration)

		// Find existing watch time for this video
		const existingWatchTime = videoWatchTimes.find(
			(wt) => wt.videoId === videoId,
		)
		const currentWatchedTime = existingWatchTime?.watchedTime || 0

		setCurrentVideoTime(currentWatchedTime)

		// Start tracking every second
		watchTimeRef.current = setInterval(() => {
			if (isVideoPlaying) {
				const newWatchedTime = Math.min(currentWatchedTime + 1, totalTime)
				setCurrentVideoTime(newWatchedTime)

				// Update watch times
				setVideoWatchTimes((prev) => {
					const updated = prev.filter((wt) => wt.videoId !== videoId)
					updated.push({
						videoId,
						watchedTime: newWatchedTime,
						totalTime,
						lastWatched: new Date().toISOString(),
					})
					return updated
				})

				// Update progress based on watch time
				const newProgress = calculateProgressFromWatchTime()
				setLocalProgress(newProgress)
				onProgressUpdate?.(newProgress)
			}
		}, 1000)
	}

	// Stop tracking video time
	const stopVideoTracking = () => {
		if (watchTimeRef.current) {
			clearInterval(watchTimeRef.current)
			watchTimeRef.current = null
		}
		setIsVideoPlaying(false)
	}

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (watchTimeRef.current) {
				clearInterval(watchTimeRef.current)
			}
		}
	}, [])

	// Handle video selection
	const handleVideoSelect = (video: YouTubeVideo) => {
		onVideoSelect(video)
		setIsWatching(true)
		startVideoTracking(video)
	}

	// Handle video play/pause
	const handleVideoPlay = () => {
		setIsVideoPlaying(true)
	}

	// const handleVideoPause = () => {
	// 	setIsVideoPlaying(false)
	// }

	const handleProgressChange = (newProgress: number) => {
		setLocalProgress(newProgress)
		onProgressUpdate?.(newProgress)
	}

	const formatDuration = (duration: string) => {
		return duration === 'Unknown' ? 'N/A' : duration
	}

	const formatViewCount = (viewCount: string) => {
		if (viewCount === 'Unknown') return 'N/A'
		const count = parseInt(viewCount)
		if (count >= 1000000) {
			return `${(count / 1000000).toFixed(1)}M views`
		} else if (count >= 1000) {
			return `${(count / 1000).toFixed(1)}K views`
		}
		return `${count} views`
	}

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-3">
						{getFontAwesomeIcon('Play', 'w-6 h-6 text-red-600')}
						<span>{moduleTitle}</span>
					</DialogTitle>
					<DialogDescription className="text-base">
						{moduleDescription}
					</DialogDescription>
				</DialogHeader>

				{/* Progress Section */}
				<div className="mb-6">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm font-medium text-gray-700 dark:text-gray-300">
							Learning Progress
						</span>
						<span className="text-sm text-gray-600 dark:text-gray-400">
							{localProgress}%
						</span>
					</div>
					<Progress value={localProgress} className="h-2" />
				</div>

				{/* Video Player Section */}
				{selectedVideo && isWatching && (
					<div className="mb-6">
						<div className="relative w-full h-64 md:h-80 bg-black rounded-lg overflow-hidden">
							<iframe
								src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1&rel=0`}
								title={selectedVideo.title}
								className="w-full h-full"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
								onLoad={() => {
									// Start tracking when video loads
									handleVideoPlay()
								}}
							/>
						</div>
						<div className="mt-4">
							<h3 className="font-semibold text-lg text-gray-900 dark:text-white">
								{selectedVideo.title}
							</h3>
							<div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
								<span>{selectedVideo.channelTitle}</span>
								<span>•</span>
								<span>{formatDuration(selectedVideo.duration)}</span>
								<span>•</span>
								<span>{formatViewCount(selectedVideo.viewCount)}</span>
							</div>

							{/* Video Watch Progress */}
							<div className="mt-3">
								<div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
									<span>Watch Progress</span>
									<span>
										{Math.floor(currentVideoTime / 60)}:
										{(currentVideoTime % 60).toString().padStart(2, '0')} /{' '}
										{formatDuration(selectedVideo.duration)}
									</span>
								</div>
								<Progress
									value={
										selectedVideo.duration !== 'Unknown'
											? (currentVideoTime /
													parseDuration(selectedVideo.duration)) *
											  100
											: 0
									}
									className="h-2"
								/>
							</div>
						</div>
					</div>
				)}

				{/* Video List */}
				<div className="space-y-4">
					<h4 className="font-semibold text-lg text-gray-900 dark:text-white">
						Recommended Videos
					</h4>
					<div className="grid gap-4">
						{videos.map((video, index) => (
							<div
								key={`${video.id}-${index}`} // Use unique key with index
								className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
									selectedVideo?.id === video.id
										? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
										: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
								}`}
								onClick={() => handleVideoSelect(video)}
							>
								<div className="flex gap-4">
									<div className="relative flex-shrink-0">
										<Image
											src={video.thumbnail}
											alt={video.title}
											width={128}
											height={80}
											className="w-32 h-20 object-cover rounded"
										/>
										<div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
											{formatDuration(video.duration)}
										</div>
									</div>
									<div className="flex-1 min-w-0">
										<h5 className="font-medium text-gray-900 dark:text-white line-clamp-2">
											{video.title}
										</h5>
										<p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
											{video.description}
										</p>
										<div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
											<span>{video.channelTitle}</span>
											<span>•</span>
											<span>{formatViewCount(video.viewCount)}</span>
											<span>•</span>
											<span>
												{new Date(video.publishedAt).toLocaleDateString()}
											</span>
										</div>
									</div>
									<div className="flex-shrink-0">
										<Badge
											variant={
												selectedVideo?.id === video.id ? 'default' : 'secondary'
											}
											className="text-xs"
										>
											{selectedVideo?.id === video.id ? 'Watching' : 'Watch'}
										</Badge>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() =>
								handleProgressChange(Math.min(95, localProgress + 25))
							}
							disabled={
								localProgress >= 95 ||
								getTotalWatchedTime() < getTotalRequiredTime() * 0.5
							}
						>
							{getFontAwesomeIcon('Check', 'w-4 h-4 mr-2')}
							Mark 25% Complete
						</Button>
						<Button
							variant="outline"
							onClick={() => handleProgressChange(100)}
							disabled={
								localProgress >= 100 ||
								getTotalWatchedTime() < getTotalRequiredTime() * 0.95
							}
						>
							{getFontAwesomeIcon('Trophy', 'w-4 h-4 mr-2')}
							{getTotalWatchedTime() < getTotalRequiredTime() * 0.95
								? `Watch ${Math.ceil(
										(getTotalRequiredTime() * 0.95 - getTotalWatchedTime()) /
											60,
								  )}m more`
								: 'Mark Complete'}
						</Button>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							onClick={() => {
								stopVideoTracking()
								onClose()
							}}
						>
							{getFontAwesomeIcon('Pause', 'w-4 h-4 mr-2')}
							Pause & Close
						</Button>
						<Button onClick={onClose}>
							{getFontAwesomeIcon('X', 'w-4 h-4 mr-2')}
							Close
						</Button>
					</div>
				</div>

				{/* Watch Time Summary */}
				{getTotalWatchedTime() > 0 && (
					<div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
						<div className="flex items-center gap-2 text-sm text-blue-800 dark:text-blue-200">
							{getFontAwesomeIcon('Clock', 'w-4 h-4')}
							<span>
								Watched: {Math.floor(getTotalWatchedTime() / 60)}:
								{(getTotalWatchedTime() % 60).toString().padStart(2, '0')} /{' '}
								{Math.floor(getTotalRequiredTime() / 60)}:
								{(getTotalRequiredTime() % 60).toString().padStart(2, '0')}
							</span>
						</div>
						<div className="text-xs text-blue-600 dark:text-blue-300 mt-1">
							{getTotalWatchedTime() < getTotalRequiredTime() * 0.95 ? (
								<>
									<strong>STRICT MODE:</strong> Watch{' '}
									{Math.ceil(
										(getTotalRequiredTime() * 0.95 - getTotalWatchedTime()) /
											60,
									)}{' '}
									more minutes to unlock completion (95% required)
								</>
							) : (
								<>
									<strong>✅ READY TO COMPLETE:</strong> You&apos;ve watched
									enough content!
								</>
							)}
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	)
}
