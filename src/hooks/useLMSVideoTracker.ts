import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useEffect, useRef } from 'react'

interface LMSVideoTrackingData {
	videoId: string
	moduleId: string
	moduleTitle: string
	action: string
	progress?: number
	currentTime?: number
	duration?: number
	playbackRate?: number
	volume?: number
	quality?: string
	metadata?: Record<string, unknown>
}

export const useLMSVideoTracker = () => {
	const { authState } = useAuth()
	const sessionStartTime = useRef<number>(Date.now())
	const lastProgressTime = useRef<number>(0)
	const progressInterval = useRef<NodeJS.Timeout | null>(null)

	// Track video event
	const trackVideoEvent = useCallback(
		async (data: LMSVideoTrackingData) => {
			if (!authState.user?.id) return

			try {
				await fetch('/api/lms-video-tracking', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: authState.user.id,
						...data,
						metadata: {
							...data.metadata,
							sessionDuration: Math.round(
								(Date.now() - sessionStartTime.current) / 1000 / 60,
							),
							timestamp: new Date().toISOString(),
						},
					}),
				})
			} catch (error) {
				console.error('Error tracking LMS video event:', error)
			}
		},
		[authState.user?.id],
	)

	// Track video play
	const trackVideoPlay = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			currentTime: number,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			sessionStartTime.current = Date.now()
			lastProgressTime.current = currentTime

			await trackVideoEvent({
				videoId,
				moduleId,
				moduleTitle,
				action: 'play',
				currentTime,
				duration,
				progress: Math.round((currentTime / duration) * 100),
				metadata: {
					...metadata,
					playTimestamp: new Date().toISOString(),
				},
			})

			// Start progress tracking
			progressInterval.current = setInterval(() => {
				trackVideoProgress(
					videoId,
					moduleId,
					moduleTitle,
					currentTime,
					duration,
					metadata,
				)
			}, 10000) // Track every 10 seconds
		},
		[trackVideoEvent],
	)

	// Track video pause
	const trackVideoPause = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			currentTime: number,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			// Clear progress tracking
			if (progressInterval.current) {
				clearInterval(progressInterval.current)
				progressInterval.current = null
			}

			await trackVideoEvent({
				videoId,
				moduleId,
				moduleTitle,
				action: 'pause',
				currentTime,
				duration,
				progress: Math.round((currentTime / duration) * 100),
				metadata: {
					...metadata,
					pauseTimestamp: new Date().toISOString(),
					timeWatched: currentTime - lastProgressTime.current,
				},
			})
		},
		[trackVideoEvent],
	)

	// Track video progress
	const trackVideoProgress = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			currentTime: number,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			const progress = Math.round((currentTime / duration) * 100)

			// Only track significant progress changes (every 5%)
			if (progress % 5 === 0 && progress > lastProgressTime.current) {
				lastProgressTime.current = progress

				await trackVideoEvent({
					videoId,
					moduleId,
					moduleTitle,
					action: 'progress',
					currentTime,
					duration,
					progress,
					metadata: {
						...metadata,
						progressMilestone: progress,
						progressTimestamp: new Date().toISOString(),
					},
				})
			}
		},
		[trackVideoEvent],
	)

	// Track video seek
	const trackVideoSeek = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			fromTime: number,
			toTime: number,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackVideoEvent({
				videoId,
				moduleId,
				moduleTitle,
				action: 'seek',
				currentTime: toTime,
				duration,
				progress: Math.round((toTime / duration) * 100),
				metadata: {
					...metadata,
					fromTime,
					toTime,
					seekDistance: Math.abs(toTime - fromTime),
					seekTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackVideoEvent],
	)

	// Track video completion
	const trackVideoComplete = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			// Clear progress tracking
			if (progressInterval.current) {
				clearInterval(progressInterval.current)
				progressInterval.current = null
			}

			await trackVideoEvent({
				videoId,
				moduleId,
				moduleTitle,
				action: 'complete',
				currentTime: duration,
				duration,
				progress: 100,
				metadata: {
					...metadata,
					completionTime: new Date().toISOString(),
					totalSessionTime: Math.round(
						(Date.now() - sessionStartTime.current) / 1000 / 60,
					),
				},
			})
		},
		[trackVideoEvent],
	)

	// Track playback rate change
	const trackPlaybackRateChange = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			playbackRate: number,
			currentTime: number,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackVideoEvent({
				videoId,
				moduleId,
				moduleTitle,
				action: 'playback_rate_change',
				currentTime,
				duration,
				playbackRate,
				metadata: {
					...metadata,
					playbackRateChange: playbackRate,
					changeTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackVideoEvent],
	)

	// Track quality change
	const trackQualityChange = useCallback(
		async (
			videoId: string,
			moduleId: string,
			moduleTitle: string,
			quality: string,
			currentTime: number,
			duration: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackVideoEvent({
				videoId,
				moduleId,
				moduleTitle,
				action: 'quality_change',
				currentTime,
				duration,
				quality,
				metadata: {
					...metadata,
					qualityChange: quality,
					changeTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackVideoEvent],
	)

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (progressInterval.current) {
				clearInterval(progressInterval.current)
			}
		}
	}, [])

	return {
		trackVideoPlay,
		trackVideoPause,
		trackVideoProgress,
		trackVideoSeek,
		trackVideoComplete,
		trackPlaybackRateChange,
		trackQualityChange,
	}
}
