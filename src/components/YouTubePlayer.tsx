'use client'

import { LoadingSpinner } from '@/components/LoadingSpinner'
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
import { useCallback, useEffect, useRef, useState } from 'react'

interface YouTubePlayer {
	playVideo(): void
	pauseVideo(): void
	getCurrentTime(): number
	getDuration(): number
}

interface YouTubePlayerProps {
	videoId: string
	moduleId: string
	videoTitle: string
	videoUrl: string
	thumbnail?: string
	onVideoComplete?: () => void
}

// YouTube Player API types
interface YouTubePlayer {
	playVideo: () => void
	pauseVideo: () => void
	seekTo: (seconds: number) => void
	getCurrentTime: () => number
	getDuration: () => number
	getPlayerState: () => number
	addEventListener: (event: string, listener: () => void) => void
	removeEventListener: (event: string, listener: () => void) => void
}

declare global {
	interface Window {
		YT: {
			Player: new (elementId: string, config: unknown) => unknown
			PlayerState: {
				ENDED: number
				PLAYING: number
				PAUSED: number
				BUFFERING: number
				CUED: number
			}
		}
		onYouTubeIframeAPIReady: () => void
	}
}

export const YouTubePlayer = ({
	videoId,
	moduleId,
	videoTitle,
	// videoUrl,
	// thumbnail,
	onVideoComplete,
}: YouTubePlayerProps) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [showBookmarkModal, setShowBookmarkModal] = useState(false)
	const [showNoteModal, setShowNoteModal] = useState(false)
	const [noteText, setNoteText] = useState('')
	const [isPlayerReady, setIsPlayerReady] = useState(false)
	const [isApiLoaded, setIsApiLoaded] = useState(false)
	const playerRef = useRef<YouTubePlayer | null>(null)
	const iframeRef = useRef<HTMLDivElement>(null)
	const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)

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
		onProgressUpdate: () => {
			// This will be called by the tracker
		},
	})

	const handleReady = useCallback(() => {
		console.log('YouTube player ready')
		setIsPlayerReady(true)
		if (playerRef.current) {
			const duration = playerRef.current.getDuration()
			setDuration(duration)
			console.log('Video duration:', duration)
		}
	}, [])

	const startProgressInterval = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current)
		}
		progressIntervalRef.current = setInterval(() => {
			if (playerRef.current && isPlaying) {
				const currentTime = playerRef.current.getCurrentTime()
				const duration = playerRef.current.getDuration()
				setCurrentTime(currentTime)
				setDuration(duration)
			}
		}, 1000) // Update every second
	}, [isPlaying])

	const stopProgressInterval = useCallback(() => {
		if (progressIntervalRef.current) {
			clearInterval(progressIntervalRef.current)
			progressIntervalRef.current = null
		}
	}, [])

	const handleStateChange = useCallback(
		(event: { data: number }) => {
			console.log('YouTube player state change:', event.data)
			if (playerRef.current) {
				const state = event.data
				const currentTime = playerRef.current.getCurrentTime()
				const duration = playerRef.current.getDuration()

				setCurrentTime(currentTime)
				setDuration(duration)

				switch (state) {
					case window.YT.PlayerState.PLAYING:
						console.log('Video playing')
						setIsPlaying(true)
						startTracking(currentTime, duration)
						startProgressInterval()
						break
					case window.YT.PlayerState.PAUSED:
						console.log('Video paused')
						setIsPlaying(false)
						stopTracking(currentTime, duration)
						stopProgressInterval()
						break
					case window.YT.PlayerState.ENDED:
						console.log('Video ended')
						setIsPlaying(false)
						stopTracking(currentTime, duration)
						stopProgressInterval()
						trackCompletion(duration)
						onVideoComplete?.()
						break
				}
			}
		},
		[startTracking, stopTracking, trackCompletion, onVideoComplete, startProgressInterval, stopProgressInterval],
	)

	// Load YouTube API
	const initializePlayer = useCallback(() => {
		if (iframeRef.current && window.YT && window.YT.Player) {
			try {
				playerRef.current = new window.YT.Player(iframeRef.current.id, {
					height: '315',
					width: '100%',
					videoId: videoId,
					playerVars: {
						playsinline: 1,
						controls: 1,
						modestbranding: 1,
						rel: 0,
						fs: 1,
						cc_load_policy: 0,
					},
					events: {
						onReady: handleReady,
						onStateChange: handleStateChange,
					},
				}) as unknown as YouTubePlayer
			} catch (error) {
				console.error('Error initializing YouTube player:', error)
			}
		}
	}, [videoId, handleReady, handleStateChange])

	// Load YouTube API
	useEffect(() => {
		const loadYouTubeAPI = () => {
			if (window.YT && window.YT.Player) {
				setIsApiLoaded(true)
				initializePlayer()
			} else {
				// Load the API
				const tag = document.createElement('script')
				tag.src = 'https://www.youtube.com/iframe_api'
				const firstScriptTag = document.getElementsByTagName('script')[0]
				firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

				window.onYouTubeIframeAPIReady = () => {
					setIsApiLoaded(true)
					initializePlayer()
				}
			}
		}

		loadYouTubeAPI()

		return () => {
			if (progressIntervalRef.current) {
				clearInterval(progressIntervalRef.current)
			}
		}
	}, [videoId, initializePlayer])



	// Initialize player when API is loaded
	useEffect(() => {
		if (isApiLoaded && !playerRef.current) {
			initializePlayer()
		}
	}, [isApiLoaded, initializePlayer])

	const handlePlay = () => {
		if (playerRef.current) {
			playerRef.current.playVideo()
		}
	}

	const handlePause = () => {
		if (playerRef.current) {
			playerRef.current.pauseVideo()
		}
	}

	const handleSeek = (seekTime: number) => {
		if (playerRef.current) {
			const previousTime = currentTime
			playerRef.current.seekTo(seekTime)
			setCurrentTime(seekTime)
			trackSeek(previousTime, seekTime, duration)
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
				{/* YouTube Player */}
				<div className="relative">
					<div
						ref={iframeRef}
						id={`youtube-player-${videoId}`}
						className="w-full aspect-video rounded-lg overflow-hidden"
					/>
					{!isPlayerReady && (
						<div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
							<div className="text-center">
								<LoadingSpinner size="md" variant="default" />
								<p className="text-sm text-gray-600 mt-2">
									Loading YouTube player...
								</p>
							</div>
						</div>
					)}
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
							disabled={!isPlayerReady}
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
							disabled={!isPlayerReady}
						>
							<BookmarkIcon className="w-4 h-4 mr-1" />
							Bookmark
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setShowNoteModal(true)}
							disabled={!isPlayerReady}
						>
							<PencilIcon className="w-4 h-4 mr-1" />
							Note
						</Button>
					</div>
				</div>

				{/* Debug Info */}
				{process.env.NODE_ENV === 'development' && (
					<div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
						Debug: Ready: {isPlayerReady ? 'Yes' : 'No'}, Playing:{' '}
						{isPlaying ? 'Yes' : 'No'}, Time: {formatTime(currentTime)}/
						{formatTime(duration)}, Progress: {Math.round(progressPercentage)}%
					</div>
				)}

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
