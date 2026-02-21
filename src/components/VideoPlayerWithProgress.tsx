'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useRealTimeVideoTracker } from '@/hooks/useRealTimeVideoTracker'
import {
	BookmarkIcon,
	CheckCircleIcon,
	ClockIcon,
	PauseIcon,
	PencilIcon,
	PlayIcon,
} from '@heroicons/react/24/outline'
import { useRef, useState } from 'react'

interface VideoPlayerWithProgressProps {
	videoId: string
	moduleId: string
	videoTitle: string
	videoUrl: string
	thumbnail?: string
	onVideoComplete?: () => void
}

export const VideoPlayerWithProgress = ({
	videoId,
	moduleId,
	videoTitle,
	videoUrl,
	thumbnail,
	onVideoComplete,
}: VideoPlayerWithProgressProps) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [showBookmarkModal, setShowBookmarkModal] = useState(false)
	const [showNoteModal, setShowNoteModal] = useState(false)
	const [noteText, setNoteText] = useState('')
	const videoRef = useRef<HTMLVideoElement>(null)

	const {
		progress,
		isTracking,
		startTracking,
		stopTracking,
		trackCompletion,
		trackSeek,
		addBookmark,
		addNote,
	} = useRealTimeVideoTracker({
		videoId,
		moduleId,
		videoTitle,
		onProgressUpdate: (progressData) => {
			// Update video time if needed
			if (progressData.currentTime !== currentTime) {
				setCurrentTime(progressData.currentTime)
			}
		},
	})

	// Handle video events
	const handlePlay = () => {
		if (videoRef.current) {
			videoRef.current.play()
			setIsPlaying(true)
			startTracking(currentTime, duration)
		}
	}

	const handlePause = () => {
		if (videoRef.current) {
			videoRef.current.pause()
			setIsPlaying(false)
			stopTracking(currentTime, duration)
		}
	}

	const handleSeek = (seekTime: number) => {
		if (videoRef.current) {
			const previousTime = currentTime
			videoRef.current.currentTime = seekTime
			setCurrentTime(seekTime)
			trackSeek(previousTime, seekTime, duration)
		}
	}

	const handleTimeUpdate = () => {
		if (videoRef.current) {
			const newTime = videoRef.current.currentTime
			setCurrentTime(newTime)

			// Check if video is completed
			if (newTime >= duration - 1 && duration > 0) {
				trackCompletion(duration)
				onVideoComplete?.()
			}
		}
	}

	const handleLoadedMetadata = () => {
		if (videoRef.current) {
			setDuration(videoRef.current.duration)
		}
	}

	const handleBookmark = async () => {
		await addBookmark(currentTime, {
			bookmarkTitle: `Bookmark at ${formatTime(currentTime)}`,
		})
		setShowBookmarkModal(false)
	}

	const handleAddNote = async () => {
		if (noteText.trim()) {
			await addNote(noteText, currentTime, {
				noteTitle: `Note at ${formatTime(currentTime)}`,
			})
			setNoteText('')
			setShowNoteModal(false)
		}
	}

	const formatTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600)
		const minutes = Math.floor((seconds % 3600) / 60)
		const secs = Math.floor(seconds % 60)

		if (hours > 0) {
			return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
				.toString()
				.padStart(2, '0')}`
		}
		return `${minutes}:${secs.toString().padStart(2, '0')}`
	}

	const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{videoTitle}</span>
					<div className="flex items-center gap-2">
						{progress.completed && (
							<Badge variant="default" className="bg-green-100 text-green-800">
								<CheckCircleIcon className="w-4 h-4 mr-1" />
								Completed
							</Badge>
						)}
						{isTracking && (
							<Badge variant="secondary" className="bg-blue-100 text-blue-800">
								<ClockIcon className="w-4 h-4 mr-1" />
								Tracking
							</Badge>
						)}
					</div>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Video Player */}
				<div className="relative">
					<video
						ref={videoRef}
						className="w-full rounded-lg"
						poster={thumbnail}
						onTimeUpdate={handleTimeUpdate}
						onLoadedMetadata={handleLoadedMetadata}
						onEnded={() => {
							setIsPlaying(false)
							trackCompletion(duration)
							onVideoComplete?.()
						}}
					>
						<source src={videoUrl} type="video/mp4" />
						Your browser does not support the video tag.
					</video>
				</div>

				{/* Progress Bar */}
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm text-gray-600">
						<span>{formatTime(currentTime)}</span>
						<span>{formatTime(duration)}</span>
					</div>
					<div className="relative">
						<Progress
							value={progressPercentage}
							className="w-full h-2 cursor-pointer"
							onClick={(e) => {
								const rect = e.currentTarget.getBoundingClientRect()
								const clickX = e.clientX - rect.left
								const newTime = (clickX / rect.width) * duration
								handleSeek(newTime)
							}}
						/>
						<div
							className="absolute top-0 left-0 h-2 bg-purple-500 rounded-full transition-all duration-200"
							style={{ width: `${progressPercentage}%` }}
						/>
					</div>
					<div className="flex items-center justify-between text-xs text-gray-500">
						<span>Progress: {Math.round(progressPercentage)}%</span>
						<span>Watched: {formatTime(progress.currentTime)}</span>
					</div>
				</div>

				{/* Controls */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={isPlaying ? handlePause : handlePlay}
						>
							{isPlaying ? (
								<PauseIcon className="w-4 h-4 mr-1" />
							) : (
								<PlayIcon className="w-4 h-4 mr-1" />
							)}
							{isPlaying ? 'Pause' : 'Play'}
						</Button>
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowBookmarkModal(true)}
						>
							<BookmarkIcon className="w-4 h-4 mr-1" />
							Bookmark
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowNoteModal(true)}
						>
							<PencilIcon className="w-4 h-4 mr-1" />
							Note
						</Button>
					</div>
				</div>

				{/* Bookmark Modal */}
				{showBookmarkModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<Card className="w-96">
							<CardHeader>
								<CardTitle>Add Bookmark</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-gray-600">
									Add a bookmark at {formatTime(currentTime)}
								</p>
								<div className="flex gap-2">
									<Button onClick={handleBookmark} className="flex-1">
										Add Bookmark
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowBookmarkModal(false)}
									>
										Cancel
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* Note Modal */}
				{showNoteModal && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<Card className="w-96">
							<CardHeader>
								<CardTitle>Add Note</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-gray-600">
									Add a note at {formatTime(currentTime)}
								</p>
								<textarea
									value={noteText}
									onChange={(e) => setNoteText(e.target.value)}
									placeholder="Enter your note here..."
									className="w-full p-2 border rounded-md"
									rows={3}
								/>
								<div className="flex gap-2">
									<Button onClick={handleAddNote} className="flex-1">
										Add Note
									</Button>
									<Button
										variant="outline"
										onClick={() => setShowNoteModal(false)}
									>
										Cancel
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</CardContent>
		</Card>
	)
}
