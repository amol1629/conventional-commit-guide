// Database Types and Interfaces

import { ObjectId } from 'mongodb'

export interface User {
	_id?: ObjectId
	userId: string // Unique identifier for the user
	email: string
	name: string
	password: string // Hashed password
	avatar?: string
	createdAt: Date
	lastActive: Date
	lastLogin?: Date
	signupDate: Date
	loginCount: number
	oauthProvider?: string // e.g., "google", "github", etc.
	oauthProviderId?: string // The user's ID from the OAuth provider
	preferences?: {
		theme?: 'light' | 'dark'
		notifications?: boolean
	}
}

export interface ModuleProgress {
	_id?: string
	userId: string
	moduleId: string
	moduleTitle: string
	progress: number // 0-100
	completed: boolean
	startedAt: Date
	completedAt?: Date
	timeSpent: number // in minutes
	videosWatched: string[] // Array of video IDs
	lastAccessed: Date
	watchTimes: VideoWatchTime[]
}

export interface VideoWatchTime {
	videoId: string
	watchedTime: number // in seconds
	totalTime: number // in seconds
	lastWatched: Date
	completed: boolean
}

export interface LearningStats {
	_id?: string
	userId: string
	totalModules: number
	completedModules: number
	totalProgress: number
	totalTimeSpent: number // in minutes
	streak: number
	lastActivity: Date
	achievements: string[]
	createdAt: Date
	updatedAt: Date
}

export interface Achievement {
	_id?: string
	achievementId: string
	title: string
	description: string
	icon: string
	category: 'learning' | 'streak' | 'completion' | 'time'
	requirements: {
		type: 'modules_completed' | 'time_spent' | 'streak_days' | 'perfect_scores'
		value: number
	}
	unlocked: boolean
	unlockedAt?: Date
}

export interface UserAchievement {
	_id?: string
	userId: string
	achievementId: string
	unlockedAt: Date
	progress?: number // Current progress towards achievement
}

export interface VideoSession {
	_id?: string
	userId: string
	moduleId: string
	videoId: string
	sessionId: string
	startTime: Date
	endTime?: Date
	duration: number // in seconds
	completed: boolean
	progress: number // 0-100
}

// API Response Types
export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	error?: string
	message?: string
}

export interface ProgressUpdateRequest {
	userId: string
	moduleId: string
	progress: number
	videoId?: string
	watchTime?: number
}

export interface StatsResponse {
	stats: LearningStats
	achievements: Achievement[]
	recentActivity: ModuleProgress[]
}
