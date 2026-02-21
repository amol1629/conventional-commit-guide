import { useAuth } from '@/contexts/AuthContext'
import { useCallback, useEffect, useRef } from 'react'

interface LearningActivity {
	activityType: string
	moduleId?: string
	moduleTitle?: string
	progress?: number
	timeSpent?: number
	metadata?: Record<string, unknown>
}

export const useLearningTracker = () => {
	const { authState } = useAuth()
	const startTime = useRef<number>(Date.now())
	const currentModule = useRef<string | null>(null)

	// Track activity
	const trackActivity = useCallback(
		async (activity: LearningActivity) => {
			if (!authState.user?.id) return

			try {
				await fetch('/api/track-learning', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						userId: authState.user.id,
						...activity,
					}),
				})
			} catch (error) {
				console.error('Error tracking learning activity:', error)
			}
		},
		[authState.user?.id],
	)

	// Track module start
	const trackModuleStart = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			metadata?: Record<string, unknown>,
		) => {
			currentModule.current = moduleId
			startTime.current = Date.now()

			await trackActivity({
				activityType: 'module_start',
				moduleId,
				moduleTitle,
				progress: 0,
				timeSpent: 0,
				metadata,
			})
		},
		[trackActivity],
	)

	// Track module progress
	const trackModuleProgress = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			progress: number,
			metadata?: Record<string, unknown>,
		) => {
			const timeSpent = Math.round((Date.now() - startTime.current) / 1000 / 60) // in minutes

			await trackActivity({
				activityType: 'module_progress',
				moduleId,
				moduleTitle,
				progress,
				timeSpent,
				metadata,
			})
		},
		[trackActivity],
	)

	// Track module completion
	const trackModuleComplete = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			progress: number = 100,
			metadata?: Record<string, unknown>,
		) => {
			const timeSpent = Math.round((Date.now() - startTime.current) / 1000 / 60) // in minutes

			await trackActivity({
				activityType: 'module_complete',
				moduleId,
				moduleTitle,
				progress,
				timeSpent,
				metadata,
			})
		},
		[trackActivity],
	)

	// Track practice session
	const trackPracticeSession = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			score?: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackActivity({
				activityType: 'practice_session',
				moduleId,
				moduleTitle,
				progress: score || 0,
				timeSpent: 0,
				metadata,
			})
		},
		[trackActivity],
	)

	// Track commit practice
	const trackCommitPractice = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			success: boolean,
			metadata?: Record<string, unknown>,
		) => {
			await trackActivity({
				activityType: 'commit_practice',
				moduleId,
				moduleTitle,
				progress: success ? 100 : 0,
				timeSpent: 0,
				metadata: {
					...metadata,
					success,
				},
			})
		},
		[trackActivity],
	)

	// Track video watch
	const trackVideoWatch = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			videoId: string,
			watchTime: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackActivity({
				activityType: 'video_watch',
				moduleId,
				moduleTitle,
				progress: 0,
				timeSpent: Math.round(watchTime / 60), // convert to minutes
				metadata: {
					...metadata,
					videoId,
					watchTime,
				},
			})
		},
		[trackActivity],
	)

	// Track quiz completion
	const trackQuizComplete = useCallback(
		async (
			moduleId: string,
			moduleTitle: string,
			score: number,
			totalQuestions: number,
			metadata?: Record<string, unknown>,
		) => {
			await trackActivity({
				activityType: 'quiz_complete',
				moduleId,
				moduleTitle,
				progress: Math.round((score / totalQuestions) * 100),
				timeSpent: 0,
				metadata: {
					...metadata,
					score,
					totalQuestions,
				},
			})
		},
		[trackActivity],
	)

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			// Track final activity if module was started
			if (currentModule.current && authState.user?.id) {
				const timeSpent = Math.round(
					(Date.now() - startTime.current) / 1000 / 60,
				)
				if (timeSpent > 0) {
					trackActivity({
						activityType: 'module_session_end',
						moduleId: currentModule.current,
						moduleTitle: currentModule.current,
						timeSpent,
					})
				}
			}
		}
	}, [authState.user?.id, trackActivity])

	return {
		trackModuleStart,
		trackModuleProgress,
		trackModuleComplete,
		trackPracticeSession,
		trackCommitPractice,
		trackVideoWatch,
		trackQuizComplete,
	}
}
