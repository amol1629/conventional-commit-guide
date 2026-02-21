import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useEffect, useRef, useState } from 'react'

interface VideoProgress {
	progress: number
	currentTime: number
	duration: number
	completed: boolean
	formattedTime: string
	formattedDuration: string
}

interface RealTimeVideoTrackerProps {
	videoId: string
	moduleId: string
	videoTitle: string
	onProgressUpdate?: (progress: VideoProgress) => void
}

export const useRealTimeVideoTracker = ({
	videoId,
	moduleId,
	videoTitle,
	onProgressUpdate,
}: RealTimeVideoTrackerProps) => {
	const { authState } = useAuth()
	const [progress, setProgress] = useState<VideoProgress>({
		progress: 0,
		currentTime: 0,
		duration: 0,
		completed: false,
		formattedTime: '0:00',
		formattedDuration: '0:00',
	})
	const [isTracking, setIsTracking] = useState(false)
	const progressInterval = useRef<NodeJS.Timeout | null>(null)
	const lastTrackedProgress = useRef<number>(0)

	// Track video progress in real-time
	const trackProgress = useCallback(
		async (
			currentTime: number,
			duration: number,
			action: string = 'progress',
			metadata?: Record<string, unknown>,
		) => {
			if (!authState.user?.id) return

			try {
				const response = await fetch('/api/video-progress-live', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: authState.user.id,
						videoId,
						moduleId,
						videoTitle,
						currentTime,
						duration,
						progress: Math.round((currentTime / duration) * 100),
						action,
						metadata: {
							...metadata,
							timestamp: new Date().toISOString(),
						},
					}),
				})

				const data = await response.json()
				if (data.success) {
					setProgress(data.data)
					onProgressUpdate?.(data.data)
				}
			} catch (error) {
				console.error('Error tracking video progress:', error)
			}
		},
		[authState.user?.id, videoId, moduleId, videoTitle, onProgressUpdate],
	)

	// Start real-time tracking
	const startTracking = useCallback(
		(currentTime: number, duration: number) => {
			if (isTracking) return

			setIsTracking(true)
			lastTrackedProgress.current = 0

			// Track initial play
			trackProgress(currentTime, duration, 'play', {
				startTime: new Date().toISOString(),
			})

			// Start interval tracking every 5 seconds
			progressInterval.current = setInterval(() => {
				trackProgress(currentTime, duration, 'progress', {
					interval: true,
					previousProgress: lastTrackedProgress.current,
				})
				lastTrackedProgress.current = Math.round((currentTime / duration) * 100)
			}, 5000)
		},
		[isTracking, trackProgress],
	)

	// Stop real-time tracking
	const stopTracking = useCallback(
		(currentTime: number, duration: number) => {
			if (!isTracking) return

			setIsTracking(false)
			if (progressInterval.current) {
				clearInterval(progressInterval.current)
				progressInterval.current = null
			}

			// Track pause
			trackProgress(currentTime, duration, 'pause', {
				endTime: new Date().toISOString(),
			})
		},
		[isTracking, trackProgress],
	)

	// Track video completion
	const trackCompletion = useCallback(
		(duration: number) => {
			if (progressInterval.current) {
				clearInterval(progressInterval.current)
				progressInterval.current = null
			}

			trackProgress(duration, duration, 'complete', {
				completionTime: new Date().toISOString(),
			})
		},
		[trackProgress],
	)

	// Track seek events
	const trackSeek = useCallback(
		(fromTime: number, toTime: number, duration: number) => {
			trackProgress(toTime, duration, 'seek', {
				fromTime,
				toTime,
				seekDistance: Math.abs(toTime - fromTime),
			})
		},
		[trackProgress],
	)

	// Load existing progress
	const loadProgress = useCallback(async () => {
		if (!authState.user?.id) return

		try {
			const response = await fetch(
				`/api/video-progress-live?userId=${authState.user.id}&videoId=${videoId}`,
			)
			const data = await response.json()

			if (data.success) {
				setProgress(data.data)
				onProgressUpdate?.(data.data)
			}
		} catch (error) {
			console.error('Error loading video progress:', error)
		}
	}, [authState.user?.id, videoId, onProgressUpdate])

	// CMS actions
	const addBookmark = useCallback(
		async (bookmarkTime: number, metadata?: Record<string, unknown>) => {
			if (!authState.user?.id) return

			try {
				await fetch('/api/team-training-cms', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId: authState.user.id,
						action: 'bookmark',
						moduleId,
						videoId,
						videoTitle,
						currentTime: bookmarkTime,
						metadata: {
							...metadata,
							bookmarkTime,
						},
					}),
				})
			} catch (error) {
				console.error('Error adding bookmark:', error)
			}
		},
		[authState.user?.id, moduleId, videoId, videoTitle],
	)

	const addNote = useCallback(
		async (
			note: string,
			noteTime: number,
			metadata?: Record<string, unknown>,
		) => {
			if (!authState.user?.id) return

			try {
				await fetch('/api/team-training-cms', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						userId: authState.user.id,
						action: 'note',
						moduleId,
						videoId,
						videoTitle,
						currentTime: noteTime,
						metadata: {
							...metadata,
							note,
							noteTime,
						},
					}),
				})
			} catch (error) {
				console.error('Error adding note:', error)
			}
		},
		[authState.user?.id, moduleId, videoId, videoTitle],
	)

	// Load progress on mount
	useEffect(() => {
		loadProgress()
	}, [loadProgress])

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (progressInterval.current) {
				clearInterval(progressInterval.current)
			}
		}
	}, [])

	return {
		progress,
		isTracking,
		startTracking,
		stopTracking,
		trackCompletion,
		trackSeek,
		addBookmark,
		addNote,
		loadProgress,
	}
}
