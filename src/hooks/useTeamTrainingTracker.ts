import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useEffect, useRef } from 'react'

interface TeamTrainingEvent {
	eventType: string
	moduleId: string
	moduleTitle: string
	videoId?: string
	videoTitle?: string
	progress?: number
	timeSpent?: number
	metadata?: Record<string, unknown>
}

export const useTeamTrainingTracker = () => {
	const { authState } = useAuth()
	const sessionStartTime = useRef<number>(Date.now())
	const currentModule = useRef<string | null>(null)
	const currentVideo = useRef<string | null>(null)
	const videoStartTime = useRef<number>(Date.now())
	const interactionCount = useRef<number>(0)

	// Track detailed team training event
	const trackEvent = useCallback(
		async (event: TeamTrainingEvent) => {
			if (!authState.user?.id) return

			interactionCount.current += 1

			try {
				await fetch('/api/learning-history', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: authState.user.id,
						activityType: event.eventType,
						moduleId: event.moduleId,
						moduleTitle: event.moduleTitle,
						progress: event.progress || 0,
						timeSpent: event.timeSpent || 0,
						metadata: {
							...event.metadata,
							sessionId: `session_${Date.now()}`,
							interactionCount: interactionCount.current,
							sessionDuration: Math.round(
								(Date.now() - sessionStartTime.current) / 1000 / 60,
							),
							videoId: event.videoId,
							videoTitle: event.videoTitle,
							timestamp: new Date().toISOString(),
						},
					}),
				})
			} catch (error) {
				console.error('Error tracking team training event:', error)
			}
		},
		[authState.user?.id],
	)

	// Track module selection
	const trackModuleSelection = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			metadata?: Record<string, unknown>,
		) => {
			currentModule.current = moduleId
			sessionStartTime.current = Date.now()
			interactionCount.current = 0

			await trackEvent({
				eventType: 'module_selected',
				moduleId,
				moduleTitle,
				metadata: {
					...metadata,
					selectionTime: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track video selection
	const trackVideoSelection = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			videoId: string,
			videoTitle: string,
			videoDuration?: number,
			metadata?: Record<string, unknown>,
		) => {
			currentVideo.current = videoId
			videoStartTime.current = Date.now()

			await trackEvent({
				eventType: 'video_selected',
				moduleId,
				moduleTitle,
				videoId,
				videoTitle,
				metadata: {
					...metadata,
					videoDuration,
					selectionTime: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track video play
	const trackVideoPlay = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			videoId: string,
			videoTitle: string,
			playTime: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'video_play',
				moduleId,
				moduleTitle,
				videoId,
				videoTitle,
				timeSpent: Math.round(playTime / 60), // convert to minutes
				metadata: {
					...metadata,
					playTime,
					playTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track video pause
	const trackVideoPause = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			videoId: string,
			videoTitle: string,
			pauseTime: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'video_pause',
				moduleId,
				moduleTitle,
				videoId,
				videoTitle,
				timeSpent: Math.round(pauseTime / 60),
				metadata: {
					...metadata,
					pauseTime,
					pauseTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track video progress
	const trackVideoProgress = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			videoId: string,
			videoTitle: string,
			progress: number,
			watchTime: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'video_progress',
				moduleId,
				moduleTitle,
				videoId,
				videoTitle,
				progress,
				timeSpent: Math.round(watchTime / 60),
				metadata: {
					...metadata,
					watchTime,
					progressPercentage: progress,
					progressTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track video completion
	const trackVideoCompletion = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			videoId: string,
			videoTitle: string,
			totalWatchTime: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'video_completed',
				moduleId,
				moduleTitle,
				videoId,
				videoTitle,
				timeSpent: Math.round(totalWatchTime / 60),
				metadata: {
					...metadata,
					totalWatchTime,
					completionTime: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track module progress
	const trackModuleProgress = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			progress: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'module_progress',
				moduleId,
				moduleTitle,
				progress,
				metadata: {
					...metadata,
					progressPercentage: progress,
					progressTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track module completion
	const trackModuleCompletion = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			progress: number,
			totalTimeSpent: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'module_completed',
				moduleId,
				moduleTitle,
				progress,
				timeSpent: Math.round(totalTimeSpent / 60),
				metadata: {
					...metadata,
					completionTime: new Date().toISOString(),
					totalSessionTime: Math.round(
						(Date.now() - sessionStartTime.current) / 1000 / 60,
					),
				},
			})
		},
		[trackEvent],
	)

	// Track user interaction
	const trackUserInteraction = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			interactionType: string,
			metadata?: Record<string, unknown>,
		) => {
			await trackEvent({
				eventType: 'user_interaction',
				moduleId,
				moduleTitle,
				metadata: {
					...metadata,
					interactionType,
					interactionTimestamp: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Track session end
	const trackSessionEnd = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			metadata?: Record<string, unknown>,
		) => {
			const totalSessionTime = Math.round(
				(Date.now() - sessionStartTime.current) / 1000 / 60,
			)

			await trackEvent({
				eventType: 'session_end',
				moduleId,
				moduleTitle,
				timeSpent: totalSessionTime,
				metadata: {
					...metadata,
					totalSessionTime,
					interactionCount: interactionCount.current,
					sessionEndTime: new Date().toISOString(),
				},
			})
		},
		[trackEvent],
	)

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (currentModule.current && authState.user?.id) {
				trackSessionEnd(currentModule.current, currentModule.current, {
					cleanup: true,
				})
			}
		}
	}, [authState.user?.id, trackSessionEnd])

	return {
		trackModuleSelection,
		trackVideoSelection,
		trackVideoPlay,
		trackVideoPause,
		trackVideoProgress,
		trackVideoCompletion,
		trackModuleProgress,
		trackModuleCompletion,
		trackUserInteraction,
		trackSessionEnd,
	}
}
