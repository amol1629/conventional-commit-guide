import { getDatabase } from '@/lib/mongodb'
import {
	Achievement,
	LearningStats,
	ModuleProgress,
	User,
	UserAchievement,
	VideoSession,
} from '@/types/database'
import { ObjectId } from 'mongodb'

export class DatabaseService {
	private static instance: DatabaseService

	static getInstance(): DatabaseService {
		if (!DatabaseService.instance) {
			DatabaseService.instance = new DatabaseService()
		}
		return DatabaseService.instance
	}

	// User Management
	async createUser(
		userId: string,
		email: string,
		name: string,
		password: string,
		avatar?: string,
		oauthProvider?: string,
		oauthProviderId?: string,
	): Promise<User> {
		const db = await getDatabase()
		const users = db.collection<User>('users')

		const now = new Date()
		const user: User = {
			userId,
			email,
			name,
			password, // This should be hashed before calling this method
			avatar:
				avatar ||
				`https://ui-avatars.com/api/?name=${encodeURIComponent(
					name,
				)}&background=random`,
			createdAt: now,
			lastActive: now,
			signupDate: now,
			loginCount: 0,
			oauthProvider,
			oauthProviderId,
			preferences: {
				theme: 'light',
				notifications: true,
			},
		}

		await users.insertOne(user)
		return user
	}

	async getUser(identifier: string): Promise<User | null> {
		const db = await getDatabase()
		const users = db.collection<User>('users')
		// Try to find by userId first, then by email
		return await users.findOne({
			$or: [{ userId: identifier }, { email: identifier }],
		})
	}

	async getUserById(id: string): Promise<User | null> {
		const db = await getDatabase()
		const users = db.collection<User>('users')
		// Find by MongoDB _id - convert string to ObjectId
		try {
			const objectId = new ObjectId(id)
			return await users.findOne({ _id: objectId } as Record<string, unknown>)
		} catch (error) {
			console.error('Invalid ObjectId:', id, error)
			return null
		}
	}

	async updateUserLastActive(userId: string): Promise<void> {
		const db = await getDatabase()
		const users = db.collection<User>('users')
		await users.updateOne(
			{ userId },
			{
				$set: {
					lastActive: new Date(),
					lastLogin: new Date(),
				},
				$inc: { loginCount: 1 },
			},
		)
	}

	async updateUserProfile(
		userId: string,
		updates: { name: string; email: string },
	): Promise<User | null> {
		const db = await getDatabase()
		const users = db.collection<User>('users')

		const updateData = {
			name: updates.name,
			email: updates.email,
			avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
				updates.name,
			)}&background=random`,
			updatedAt: new Date(),
		}

		await users.updateOne(
			{ _id: new ObjectId(userId) } as Record<string, unknown>, // Use _id instead of userId
			{
				$set: updateData,
			},
		)

		// Return updated user
		return await this.getUserById(userId)
	}

	async updateUserAvatar(userId: string, avatar: string): Promise<User | null> {
		const db = await getDatabase()
		const users = db.collection<User>('users')

		await users.updateOne(
			{ _id: new ObjectId(userId) } as Record<string, unknown>,
			{
				$set: {
					avatar,
					updatedAt: new Date(),
				},
			},
		)

		// Return updated user
		return await this.getUserById(userId)
	}

	// Module Progress Management
	async updateModuleProgress(
		userId: string,
		moduleId: string,
		moduleTitle: string,
		progress: number,
		videoId?: string,
		watchTime?: number,
	): Promise<ModuleProgress> {
		const db = await getDatabase()
		const moduleProgress = db.collection<ModuleProgress>('moduleProgress')

		const now = new Date()
		const existing = await moduleProgress.findOne({ userId, moduleId })

		const timeSpent = existing
			? existing.timeSpent + (watchTime ? Math.ceil(watchTime / 60) : 1)
			: watchTime
				? Math.ceil(watchTime / 60)
				: 1
		const videosWatched = videoId
			? [...(existing?.videosWatched || []), videoId].filter(
					(v, i, arr) => arr.indexOf(v) === i,
				)
			: existing?.videosWatched || []

		const moduleProgressData: ModuleProgress = {
			userId,
			moduleId,
			moduleTitle,
			progress: Math.min(100, Math.max(0, progress)),
			completed: progress >= 100,
			startedAt: existing?.startedAt || now,
			completedAt: progress >= 100 ? now : existing?.completedAt,
			timeSpent,
			videosWatched,
			lastAccessed: now,
			watchTimes: existing?.watchTimes || [],
		}

		await moduleProgress.replaceOne({ userId, moduleId }, moduleProgressData, {
			upsert: true,
		})

		return moduleProgressData
	}

	async getModuleProgress(
		userId: string,
		moduleId: string,
	): Promise<ModuleProgress | null> {
		const db = await getDatabase()
		const moduleProgress = db.collection<ModuleProgress>('moduleProgress')
		return await moduleProgress.findOne({ userId, moduleId })
	}

	async getAllModuleProgress(userId: string): Promise<ModuleProgress[]> {
		const db = await getDatabase()
		const moduleProgress = db.collection<ModuleProgress>('moduleProgress')
		return await moduleProgress.find({ userId }).toArray()
	}

	// Learning Stats Management
	async updateLearningStats(userId: string): Promise<LearningStats> {
		const db = await getDatabase()
		const stats = db.collection<LearningStats>('learningStats')
		const moduleProgress = db.collection<ModuleProgress>('moduleProgress')

		const allProgress = await moduleProgress.find({ userId }).toArray()
		const completedModules = allProgress.filter((p) => p.completed)
		const totalTimeSpent = allProgress.reduce((sum, p) => sum + p.timeSpent, 0)
		const totalProgress =
			allProgress.length > 0
				? Math.round(
						allProgress.reduce((sum, p) => sum + p.progress, 0) /
							allProgress.length,
					)
				: 0

		// Calculate streak
		const streak = this.calculateStreak(allProgress)

		// Get achievements
		const achievements = await this.getUserAchievements(userId)
		const achievementIds = achievements.map((a) => a.achievementId)

		const learningStats: LearningStats = {
			userId,
			totalModules: allProgress.length,
			completedModules: completedModules.length,
			totalProgress,
			totalTimeSpent,
			streak,
			lastActivity: new Date(),
			achievements: achievementIds,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await stats.replaceOne({ userId }, learningStats, { upsert: true })

		return learningStats
	}

	async getLearningStats(userId: string): Promise<LearningStats | null> {
		const db = await getDatabase()
		const stats = db.collection<LearningStats>('learningStats')
		return await stats.findOne({ userId })
	}

	// Achievement Management
	async getUserAchievements(userId: string): Promise<UserAchievement[]> {
		const db = await getDatabase()
		const userAchievements = db.collection<UserAchievement>('userAchievements')
		return await userAchievements.find({ userId }).toArray()
	}

	async unlockAchievement(
		userId: string,
		achievementId: string,
	): Promise<void> {
		const db = await getDatabase()
		const userAchievements = db.collection<UserAchievement>('userAchievements')

		const existing = await userAchievements.findOne({ userId, achievementId })
		if (!existing) {
			await userAchievements.insertOne({
				userId,
				achievementId,
				unlockedAt: new Date(),
			})
		}
	}

	async getAchievementDetails(
		achievementId: string,
	): Promise<Achievement | null> {
		const db = await getDatabase()
		const achievements = db.collection<Achievement>('achievements')
		return await achievements.findOne({ achievementId })
	}

	// Video Session Management
	async createVideoSession(
		userId: string,
		moduleId: string,
		videoId: string,
		sessionId: string,
	): Promise<VideoSession> {
		const db = await getDatabase()
		const videoSessions = db.collection<VideoSession>('videoSessions')

		const session: VideoSession = {
			userId,
			moduleId,
			videoId,
			sessionId,
			startTime: new Date(),
			duration: 0,
			completed: false,
			progress: 0,
		}

		await videoSessions.insertOne(session)
		return session
	}

	async updateVideoSession(
		sessionId: string,
		duration: number,
		progress: number,
		completed: boolean = false,
	): Promise<void> {
		const db = await getDatabase()
		const videoSessions = db.collection<VideoSession>('videoSessions')

		await videoSessions.updateOne(
			{ sessionId },
			{
				$set: {
					endTime: new Date(),
					duration,
					progress,
					completed,
				},
			},
		)
	}

	// Helper Methods
	private calculateStreak(progress: ModuleProgress[]): number {
		if (progress.length === 0) return 0

		const sortedByDate = progress
			.filter((p) => p.lastAccessed)
			.sort((a, b) => b.lastAccessed.getTime() - a.lastAccessed.getTime())

		let streak = 0
		const currentDate = new Date()
		currentDate.setHours(0, 0, 0, 0)

		for (const progressItem of sortedByDate) {
			const progressDate = new Date(progressItem.lastAccessed)
			progressDate.setHours(0, 0, 0, 0)

			const diffDays = Math.floor(
				(currentDate.getTime() - progressDate.getTime()) /
					(1000 * 60 * 60 * 24),
			)

			if (diffDays === streak) {
				streak++
				currentDate.setDate(currentDate.getDate() - 1)
			} else if (diffDays > streak + 1) {
				break
			}
		}

		return streak
	}

	// Initialize default achievements
	async initializeAchievements(): Promise<void> {
		const db = await getDatabase()
		const achievements = db.collection<Achievement>('achievements')

		const defaultAchievements: Achievement[] = [
			{
				achievementId: 'first_module',
				title: 'Getting Started',
				description: 'Complete your first training module',
				icon: '🎯',
				category: 'completion',
				requirements: { type: 'modules_completed', value: 1 },
				unlocked: false,
			},
			{
				achievementId: 'half_way',
				title: 'Halfway There',
				description: 'Complete 50% of all modules',
				icon: '🏃‍♂️',
				category: 'completion',
				requirements: { type: 'modules_completed', value: 2 },
				unlocked: false,
			},
			{
				achievementId: 'completionist',
				title: 'Completionist',
				description: 'Complete all training modules',
				icon: '🏆',
				category: 'completion',
				requirements: { type: 'modules_completed', value: 3 },
				unlocked: false,
			},
			{
				achievementId: 'time_investor',
				title: 'Time Investor',
				description: 'Spend 60 minutes learning',
				icon: '⏰',
				category: 'time',
				requirements: { type: 'time_spent', value: 60 },
				unlocked: false,
			},
			{
				achievementId: 'streak_master',
				title: 'Streak Master',
				description: 'Maintain a 7-day learning streak',
				icon: '🔥',
				category: 'streak',
				requirements: { type: 'streak_days', value: 7 },
				unlocked: false,
			},
		]

		for (const achievement of defaultAchievements) {
			await achievements.replaceOne(
				{ achievementId: achievement.achievementId },
				achievement,
				{ upsert: true },
			)
		}
	}

	// Activity Tracking Methods
	async createActivity(activity: {
		userId: string
		activityType: string
		moduleId?: string | null
		moduleTitle?: string | null
		progress?: number
		timeSpent?: number
		timestamp: Date
		metadata?: Record<string, unknown>
	}) {
		const db = await getDatabase()
		const activities = db.collection('userActivities')

		const activityRecord = {
			...activity,
			_id: new ObjectId(),
			createdAt: new Date(),
		}

		await activities.insertOne(activityRecord)
		return activityRecord
	}

	async getUserActivities(userId: string, limit: number = 10) {
		const db = await getDatabase()
		const activities = db.collection('userActivities')

		return await activities
			.find({ userId })
			.sort({ timestamp: -1 })
			.limit(limit)
			.toArray()
	}

	async getUserStats(userId: string) {
		const db = await getDatabase()
		const activities = db.collection('userActivities')
		const moduleProgress = db.collection<ModuleProgress>('moduleProgress')
		const achievements = db.collection('userAchievements')

		// Get all activities for this user
		const allActivities = await activities.find({ userId }).toArray()
		const allModuleProgress = await moduleProgress.find({ userId }).toArray()
		const userAchievements = await achievements.find({ userId }).toArray()

		// Get learning stats for totalTimeSpent
		const learningStats = await this.getLearningStats(userId)

		// Calculate stats
		const modulesCompleted = allModuleProgress.filter((p) => p.completed).length
		const commitsPracticed = allActivities.filter(
			(a) => a.activityType === 'commit_practice',
		).length
		const streakDays = this.calculateStreak(allModuleProgress)
		const achievementsCount = userAchievements.length

		// Calculate learning progress
		const totalProgress =
			allModuleProgress.length > 0
				? Math.round(
						allModuleProgress.reduce((sum, p) => sum + p.progress, 0) /
							allModuleProgress.length,
					)
				: 0

		// Determine skill level
		let skillLevel = 'Beginner'
		if (totalProgress >= 80) skillLevel = 'Expert'
		else if (totalProgress >= 60) skillLevel = 'Advanced'
		else if (totalProgress >= 30) skillLevel = 'Intermediate'

		// Calculate total time invested from learning stats (primary source) and activities/modules (fallback)
		const timeFromLearningStats = learningStats?.totalTimeSpent || 0
		const totalTimeFromActivities = allActivities.reduce(
			(sum, activity) => sum + (activity.timeSpent || 0),
			0,
		)
		const totalTimeFromModules = allModuleProgress.reduce(
			(sum, progress) => sum + progress.timeSpent,
			0,
		)
		// Use learning stats as primary source, fallback to calculated time if not available
		const timeInvested =
			timeFromLearningStats > 0
				? timeFromLearningStats
				: totalTimeFromActivities + totalTimeFromModules

		return {
			modulesCompleted,
			commitsPracticed,
			streakDays,
			achievementsCount,
			learningProgress: totalProgress,
			skillLevel,
			timeInvested,
			lastActivity:
				allActivities.length > 0 ? allActivities[0].timestamp : new Date(),
		}
	}

	// Learning History Methods
	async createLearningHistoryEntry(entry: {
		userId: string
		activityType: string
		moduleId?: string | null
		moduleTitle?: string | null
		progress?: number
		timeSpent?: number
		timestamp: Date
		metadata?: Record<string, unknown>
	}) {
		const db = await getDatabase()
		const history = db.collection('learningHistory')

		const historyEntry = {
			...entry,
			_id: new ObjectId(),
			createdAt: new Date(),
		}

		await history.insertOne(historyEntry)
		return historyEntry
	}

	async getLearningHistory(
		userId: string,
		limit: number = 20,
		activityType?: string,
	) {
		const db = await getDatabase()
		const history = db.collection('learningHistory')

		const query: Record<string, unknown> = { userId }
		if (activityType) {
			query.activityType = activityType
		}

		return await history
			.find(query)
			.sort({ timestamp: -1 })
			.limit(limit)
			.toArray()
	}

	// Video Management Methods
	async getVideos(moduleId?: string, category?: string, limit: number = 50) {
		const db = await getDatabase()
		const videos = db.collection('videos')

		const query: Record<string, unknown> = {}
		if (moduleId) query.moduleId = moduleId
		if (category) query.category = category

		return await videos
			.find(query)
			.sort({ publishedAt: -1 })
			.limit(limit)
			.toArray()
	}

	async createVideo(videoData: {
		videoId: string
		title: string
		description?: string
		channelTitle?: string
		viewCount?: number
		publishedAt?: string
		duration?: number
		moduleId: string
		category?: string
		thumbnail?: string
		tags?: string[]
	}) {
		const db = await getDatabase()
		const videos = db.collection('videos')

		const video = {
			...videoData,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await videos.replaceOne({ videoId: videoData.videoId }, video, {
			upsert: true,
		})
		return video
	}

	// Commits Practice Methods
	async getCommitsPractice(userId: string, limit: number = 20) {
		const db = await getDatabase()
		const commitsPractice = db.collection('commitsPractice')

		const practiceSessions = await commitsPractice
			.find({ userId })
			.sort({ timestamp: -1 })
			.limit(limit)
			.toArray()

		const totalPracticeCount = await commitsPractice.countDocuments({ userId })
		const successfulPracticeCount = await commitsPractice.countDocuments({
			userId,
			success: true,
		})

		return {
			practiceSessions,
			totalPracticeCount,
			successfulPracticeCount,
			successRate:
				totalPracticeCount > 0
					? Math.round((successfulPracticeCount / totalPracticeCount) * 100)
					: 0,
		}
	}

	async createCommitsPractice(practiceData: {
		userId: string
		moduleId: string
		moduleTitle: string
		commitMessage?: string
		expectedType?: string
		actualType?: string
		success: boolean
		timeSpent?: number
		attempts?: number
		metadata?: Record<string, unknown>
	}) {
		const db = await getDatabase()
		const commitsPractice = db.collection('commitsPractice')

		const practiceSession = {
			...practiceData,
			timestamp: new Date(),
		}

		await commitsPractice.insertOne(practiceSession)

		// Update learning stats
		const learningStats = db.collection('learningStats')
		await learningStats.updateOne(
			{ userId: practiceData.userId },
			{
				$inc: {
					totalCommitsPracticed: 1,
					successfulCommitsPracticed: practiceData.success ? 1 : 0,
					totalTimeSpent: practiceData.timeSpent || 0,
				},
				$set: {
					lastActivity: new Date(),
					updatedAt: new Date(),
				},
			},
			{ upsert: true },
		)

		return practiceSession
	}

	// Learning Sessions Methods
	async getLearningSessions(userId: string, limit: number = 10) {
		const db = await getDatabase()
		const learningSessions = db.collection('learningSessions')

		const sessions = await learningSessions
			.find({ userId })
			.sort({ startTime: -1 })
			.limit(limit)
			.toArray()

		const totalLearningTime = await learningSessions
			.aggregate([
				{ $match: { userId } },
				{ $group: { _id: null, totalTime: { $sum: '$duration' } } },
			])
			.toArray()

		return {
			sessions,
			totalLearningTime: totalLearningTime[0]?.totalTime || 0,
		}
	}

	async createLearningSession(sessionData: {
		userId: string
		sessionId: string
		moduleId: string
		moduleTitle?: string
		startTime?: Date
		endTime?: Date
		duration?: number
		activities?: unknown[]
		metadata?: Record<string, unknown>
	}) {
		const db = await getDatabase()
		const learningSessions = db.collection('learningSessions')

		const session = {
			...sessionData,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await learningSessions.replaceOne(
			{ sessionId: sessionData.sessionId },
			session,
			{ upsert: true },
		)
		return session
	}

	async updateLearningSession(
		sessionId: string,
		updateData: {
			endTime?: Date
			duration?: number
			activities?: unknown[]
		},
	) {
		const db = await getDatabase()
		const learningSessions = db.collection('learningSessions')

		await learningSessions.updateOne(
			{ sessionId },
			{
				$set: {
					...updateData,
					updatedAt: new Date(),
				},
			},
		)
	}

	// Conventional Commits Methods
	async getConventionalCommitsActivities(userId: string, limit: number = 20) {
		const db = await getDatabase()
		const conventionalCommits = db.collection('conventionalCommits')

		const activities = await conventionalCommits
			.find({ userId })
			.sort({ timestamp: -1 })
			.limit(limit)
			.toArray()

		// Get statistics
		const totalActivities = await conventionalCommits.countDocuments({ userId })
		const completedLessons = await conventionalCommits.countDocuments({
			userId,
			activityType: 'lesson_completed',
		})
		const practiceSessions = await conventionalCommits.countDocuments({
			userId,
			activityType: 'practice_session',
		})
		const totalTimeSpent = await conventionalCommits
			.aggregate([
				{ $match: { userId } },
				{ $group: { _id: null, totalTime: { $sum: '$timeSpent' } } },
			])
			.toArray()

		return {
			activities,
			statistics: {
				totalActivities,
				completedLessons,
				practiceSessions,
				totalTimeSpent: totalTimeSpent[0]?.totalTime || 0,
			},
		}
	}

	async createConventionalCommitsActivity(activityData: {
		userId: string
		activityType: string
		lessonId?: string
		lessonTitle?: string
		progress?: number
		timeSpent?: number
		metadata?: Record<string, unknown>
	}) {
		const db = await getDatabase()
		const conventionalCommits = db.collection('conventionalCommits')

		const activity = {
			...activityData,
			timestamp: new Date(),
		}

		await conventionalCommits.insertOne(activity)

		// Update learning stats
		const learningStats = db.collection('learningStats')
		await learningStats.updateOne(
			{ userId: activityData.userId },
			{
				$inc: {
					totalTimeSpent: activityData.timeSpent || 0,
				},
				$set: {
					lastActivity: new Date(),
					updatedAt: new Date(),
				},
			},
			{ upsert: true },
		)

		return activity
	}

	// LMS Video Tracking Methods
	async getLMSVideoTracking(
		userId: string,
		videoId?: string,
		moduleId?: string,
	) {
		const db = await getDatabase()
		const videoTracking = db.collection('lmsVideoTracking')

		const query: Record<string, unknown> = { userId }
		if (videoId) query.videoId = videoId
		if (moduleId) query.moduleId = moduleId

		const trackingData = await videoTracking
			.find(query)
			.sort({ timestamp: -1 })
			.limit(100)
			.toArray()

		// Get video progress summary
		const userVideoProgress = db.collection('userVideoProgress')
		const progressData = await userVideoProgress
			.find({
				userId,
				...(videoId ? { videoId } : {}),
				...(moduleId ? { moduleId } : {}),
			})
			.toArray()

		return {
			trackingData,
			progressData,
		}
	}

	async createLMSVideoTracking(trackingData: {
		userId: string
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
	}) {
		const db = await getDatabase()
		const videoTracking = db.collection('lmsVideoTracking')

		const trackingEntry = {
			...trackingData,
			timestamp: new Date(),
		}

		await videoTracking.insertOne(trackingEntry)

		// Update user's video progress
		const userVideoProgress = db.collection('userVideoProgress')
		await userVideoProgress.updateOne(
			{ userId: trackingData.userId, videoId: trackingData.videoId },
			{
				$set: {
					userId: trackingData.userId,
					videoId: trackingData.videoId,
					moduleId: trackingData.moduleId,
					moduleTitle: trackingData.moduleTitle,
					progress: trackingData.progress || 0,
					currentTime: trackingData.currentTime || 0,
					duration: trackingData.duration || 0,
					lastAction: trackingData.action,
					lastWatched: new Date(),
					playbackRate: trackingData.playbackRate || 1.0,
					volume: trackingData.volume || 1.0,
					quality: trackingData.quality || 'auto',
					completed:
						trackingData.action === 'complete' ||
						(trackingData.progress && trackingData.progress >= 95),
				},
				$inc: {
					totalWatches: trackingData.action === 'play' ? 1 : 0,
					totalTimeWatched: trackingData.currentTime || 0,
				},
			},
			{ upsert: true },
		)

		return trackingEntry
	}
}

export const databaseService = DatabaseService.getInstance()
