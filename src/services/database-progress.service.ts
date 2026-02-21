import { ModuleProgress, LearningStats, Achievement } from '@/types/database'

export class DatabaseProgressService {
	private static instance: DatabaseProgressService
	private userId: string = 'default-user' // Default user ID for now

	static getInstance(): DatabaseProgressService {
		if (!DatabaseProgressService.instance) {
			DatabaseProgressService.instance = new DatabaseProgressService()
		}
		return DatabaseProgressService.instance
	}

	setUserId(userId: string): void {
		this.userId = userId
	}

	async getProgress(): Promise<Record<string, ModuleProgress>> {
		try {
			const response = await fetch(`/api/progress?userId=${this.userId}`)
			const result = await response.json()
			
			if (result.success && result.data) {
				// Convert array to object with moduleId as key
				const progressMap: Record<string, ModuleProgress> = {}
				result.data.forEach((progress: ModuleProgress) => {
					progressMap[progress.moduleId] = progress
				})
				return progressMap
			}
			return {}
		} catch (error) {
			console.error('Error loading progress from database:', error)
			return {}
		}
	}

	async updateModuleProgress(
		moduleId: string,
		title: string,
		progress: number,
		videoId?: string,
		watchTime?: number
	): Promise<void> {
		try {
			const response = await fetch('/api/progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: this.userId,
					moduleId,
					moduleTitle: title,
					progress,
					videoId,
					watchTime,
				}),
			})

			const result = await response.json()
			if (!result.success) {
				console.error('Error updating progress:', result.error)
			}
		} catch (error) {
			console.error('Error updating progress:', error)
		}
	}

	async getModuleProgress(moduleId: string): Promise<ModuleProgress | null> {
		try {
			const response = await fetch(`/api/progress?userId=${this.userId}&moduleId=${moduleId}`)
			const result = await response.json()
			
			if (result.success && result.data) {
				return result.data
			}
			return null
		} catch (error) {
			console.error('Error getting module progress:', error)
			return null
		}
	}

	async getLearningStats(): Promise<LearningStats> {
		try {
			const response = await fetch(`/api/stats?userId=${this.userId}`)
			const result = await response.json()
			
			if (result.success && result.data) {
				return result.data.stats
			}
			
			// Return default stats if no data
			return {
				userId: this.userId,
				totalModules: 0,
				completedModules: 0,
				totalProgress: 0,
				totalTimeSpent: 0,
				streak: 0,
				lastActivity: new Date(),
				achievements: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		} catch (error) {
			console.error('Error getting learning stats:', error)
			return {
				userId: this.userId,
				totalModules: 0,
				completedModules: 0,
				totalProgress: 0,
				totalTimeSpent: 0,
				streak: 0,
				lastActivity: new Date(),
				achievements: [],
				createdAt: new Date(),
				updatedAt: new Date(),
			}
		}
	}

	async getAchievementDetails(achievementId: string): Promise<Achievement | null> {
		try {
			const response = await fetch(`/api/achievements?achievementId=${achievementId}`)
			const result = await response.json()
			
			if (result.success && result.data) {
				return result.data
			}
			return null
		} catch (error) {
			console.error('Error getting achievement details:', error)
			return null
		}
	}

	async resetProgress(): Promise<void> {
		try {
			const response = await fetch('/api/progress/reset', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ userId: this.userId }),
			})

			const result = await response.json()
			if (!result.success) {
				console.error('Error resetting progress:', result.error)
			}
		} catch (error) {
			console.error('Error resetting progress:', error)
		}
	}
}

export const databaseProgressService = DatabaseProgressService.getInstance()
