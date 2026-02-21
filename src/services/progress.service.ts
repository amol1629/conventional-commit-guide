// Progress tracking service for training modules
export interface ModuleProgress {
	moduleId: string
	title: string
	progress: number
	completed: boolean
	startedAt: string
	completedAt?: string
	timeSpent: number // in minutes
	videosWatched: string[]
	lastAccessed: string
}

export interface LearningStats {
	totalModules: number
	completedModules: number
	totalProgress: number
	totalTimeSpent: number
	streak: number
	lastActivity: string
	achievements: string[]
}

export interface Achievement {
	id: string
	title: string
	description: string
	icon: string
	unlockedAt: string
	category: 'learning' | 'consistency' | 'mastery'
}

export class ProgressService {
	private static instance: ProgressService
	private storageKey = 'conventional-commits-progress'

	static getInstance(): ProgressService {
		if (!ProgressService.instance) {
			ProgressService.instance = new ProgressService()
		}
		return ProgressService.instance
	}

	// Get all progress data
	getProgress(): Record<string, ModuleProgress> {
		if (typeof window === 'undefined') return {}

		try {
			const stored = localStorage.getItem(this.storageKey)
			return stored ? JSON.parse(stored) : {}
		} catch (error) {
			console.error('Error loading progress:', error)
			return {}
		}
	}

	// Save progress data
	private saveProgress(progress: Record<string, ModuleProgress>): void {
		if (typeof window === 'undefined') return

		try {
			localStorage.setItem(this.storageKey, JSON.stringify(progress))
		} catch (error) {
			console.error('Error saving progress:', error)
		}
	}

	// Update module progress
	updateModuleProgress(
		moduleId: string,
		title: string,
		progress: number,
		videoId?: string,
	): void {
		const allProgress = this.getProgress()
		const now = new Date().toISOString()

		const existing = allProgress[moduleId]
		const timeSpent = existing ? existing.timeSpent + 1 : 1 // Increment by 1 minute

		allProgress[moduleId] = {
			moduleId,
			title,
			progress: Math.min(100, Math.max(0, progress)),
			completed: progress >= 100,
			startedAt: existing?.startedAt || now,
			completedAt: progress >= 100 ? now : existing?.completedAt,
			timeSpent,
			videosWatched: videoId
				? [...(existing?.videosWatched || []), videoId].filter(
						(v, i, arr) => arr.indexOf(v) === i,
				  )
				: existing?.videosWatched || [],
			lastAccessed: now,
		}

		this.saveProgress(allProgress)
	}

	// Get module progress
	getModuleProgress(moduleId: string): ModuleProgress | null {
		const allProgress = this.getProgress()
		return allProgress[moduleId] || null
	}

	// Get learning stats
	getLearningStats(): LearningStats {
		const allProgress = this.getProgress()
		const modules = Object.values(allProgress)

		const completedModules = modules.filter((m) => m.completed).length
		const totalProgress =
			modules.length > 0
				? Math.round(
						modules.reduce((sum, m) => sum + m.progress, 0) / modules.length,
				  )
				: 0
		const totalTimeSpent = modules.reduce((sum, m) => sum + m.timeSpent, 0)

		// Calculate streak (consecutive days with activity)
		const streak = this.calculateStreak(modules)

		// Get last activity
		const lastActivity =
			modules.length > 0
				? modules.reduce(
						(latest, m) => (m.lastAccessed > latest ? m.lastAccessed : latest),
						modules[0].lastAccessed,
				  )
				: new Date().toISOString()

		// Calculate achievements
		const achievements = this.calculateAchievements(modules)

		return {
			totalModules: modules.length,
			completedModules,
			totalProgress,
			totalTimeSpent,
			streak,
			lastActivity,
			achievements,
		}
	}

	// Calculate learning streak
	private calculateStreak(modules: ModuleProgress[]): number {
		if (modules.length === 0) return 0

		const activityDates = modules
			.map((m) => new Date(m.lastAccessed).toDateString())
			.filter((date, index, arr) => arr.indexOf(date) === index)
			.sort((a, b) => new Date(b).getTime() - new Date(a).getTime())

		let streak = 0
		const today = new Date().toDateString()
		const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

		// Check if there was activity today or yesterday
		if (activityDates.includes(today) || activityDates.includes(yesterday)) {
			streak = 1

			for (let i = 1; i < activityDates.length; i++) {
				const currentDate = new Date(activityDates[i])
				const previousDate = new Date(activityDates[i - 1])
				const diffDays =
					(previousDate.getTime() - currentDate.getTime()) /
					(1000 * 60 * 60 * 24)

				if (diffDays === 1) {
					streak++
				} else {
					break
				}
			}
		}

		return streak
	}

	// Calculate achievements
	private calculateAchievements(modules: ModuleProgress[]): string[] {
		const achievements: string[] = []

		// First module completed
		if (modules.some((m) => m.completed)) {
			achievements.push('first-steps')
		}

		// All modules completed
		if (modules.length > 0 && modules.every((m) => m.completed)) {
			achievements.push('master-committer')
		}

		// 7-day streak
		if (this.calculateStreak(modules) >= 7) {
			achievements.push('consistent-learner')
		}

		// 1 hour total time
		const totalTime = modules.reduce((sum, m) => sum + m.timeSpent, 0)
		if (totalTime >= 60) {
			achievements.push('dedicated-student')
		}

		// Watched 5+ videos
		const totalVideos = modules.reduce(
			(sum, m) => sum + m.videosWatched.length,
			0,
		)
		if (totalVideos >= 5) {
			achievements.push('video-enthusiast')
		}

		return achievements
	}

	// Get achievement details
	getAchievementDetails(achievementId: string): Achievement | null {
		const achievements: Record<string, Achievement> = {
			'first-steps': {
				id: 'first-steps',
				title: 'First Steps',
				description: 'Completed your first training module',
				icon: 'Trophy',
				unlockedAt: new Date().toISOString(),
				category: 'learning',
			},
			'master-committer': {
				id: 'master-committer',
				title: 'Master Committer',
				description: 'Completed all training modules',
				icon: 'Crown',
				unlockedAt: new Date().toISOString(),
				category: 'mastery',
			},
			'consistent-learner': {
				id: 'consistent-learner',
				title: 'Consistent Learner',
				description: 'Maintained a 7-day learning streak',
				icon: 'Flame',
				unlockedAt: new Date().toISOString(),
				category: 'consistency',
			},
			'dedicated-student': {
				id: 'dedicated-student',
				title: 'Dedicated Student',
				description: 'Spent over 1 hour learning',
				icon: 'Clock',
				unlockedAt: new Date().toISOString(),
				category: 'learning',
			},
			'video-enthusiast': {
				id: 'video-enthusiast',
				title: 'Video Enthusiast',
				description: 'Watched 5+ training videos',
				icon: 'Play',
				unlockedAt: new Date().toISOString(),
				category: 'learning',
			},
		}

		return achievements[achievementId] || null
	}

	// Reset all progress
	resetProgress(): void {
		if (typeof window === 'undefined') return
		localStorage.removeItem(this.storageKey)
	}
}

export const progressService = ProgressService.getInstance()
