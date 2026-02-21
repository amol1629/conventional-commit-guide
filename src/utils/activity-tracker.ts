// Activity tracking utility
export const trackActivity = async (
	userId: string,
	activityType: string,
	moduleId?: string,
	moduleTitle?: string,
	progress?: number,
	timeSpent?: number,
) => {
	try {
		const response = await fetch('/api/activity', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				userId,
				activityType,
				moduleId,
				moduleTitle,
				progress,
				timeSpent,
			}),
		})

		const data = await response.json()
		return data.success
	} catch (error) {
		console.error('Error tracking activity:', error)
		return false
	}
}

// Activity types
export const ACTIVITY_TYPES = {
	MODULE_START: 'module_start',
	MODULE_COMPLETE: 'module_complete',
	PRACTICE_SESSION: 'practice_session',
	COMMIT_PRACTICE: 'commit_practice',
	PROFILE_UPDATE: 'profile_update',
	LOGIN: 'login',
	LOGOUT: 'logout',
} as const

// Helper functions for common activities
export const trackModuleStart = (
	userId: string,
	moduleId: string,
	moduleTitle: string,
) =>
	trackActivity(userId, ACTIVITY_TYPES.MODULE_START, moduleId, moduleTitle, 0)

export const trackModuleComplete = (
	userId: string,
	moduleId: string,
	moduleTitle: string,
	progress: number,
) =>
	trackActivity(
		userId,
		ACTIVITY_TYPES.MODULE_COMPLETE,
		moduleId,
		moduleTitle,
		progress,
	)

export const trackCommitPractice = (userId: string, timeSpent: number = 0) =>
	trackActivity(
		userId,
		ACTIVITY_TYPES.COMMIT_PRACTICE,
		undefined,
		'Commit Message Practice',
		undefined,
		timeSpent,
	)

export const trackProfileUpdate = (userId: string) =>
	trackActivity(userId, ACTIVITY_TYPES.PROFILE_UPDATE)
