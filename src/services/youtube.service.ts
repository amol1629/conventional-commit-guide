// YouTube API service for fetching relevant videos
export interface YouTubeVideo {
	id: string
	title: string
	description: string
	thumbnail: string
	duration: string
	channelTitle: string
	publishedAt: string
	viewCount: string
	url: string
}

export interface YouTubeSearchResponse {
	videos: YouTubeVideo[]
	totalResults: number
}

// YouTube API key - in production, this should be in environment variables
const YOUTUBE_API_KEY =
	process.env.NEXT_PUBLIC_YOUTUBE_API_KEY ||
	'AIzaSyCwjEWCXzgMPhwqZ7cTUVCKN3FfVC-Undg'

// Search terms for different training modules
const MODULE_SEARCH_TERMS: Record<string, string[]> = {
	introduction: [
		'conventional commits tutorial',
		'git commit best practices',
		'semantic commit messages',
		'git conventional commits explained',
	],
	types: [
		'git commit types feat fix docs',
		'conventional commit types tutorial',
		'git commit message types',
		'feat fix docs style refactor',
	],
	scope: [
		'git commit scope examples',
		'conventional commits scope',
		'git commit scoping best practices',
		'commit message scope tutorial',
	],
	'breaking-changes': [
		'git breaking changes conventional commits',
		'semantic versioning breaking changes',
		'conventional commits breaking change',
		'git versioning breaking changes',
	],
	'team-workflow': [
		'conventional commits team workflow',
		'git hooks conventional commits',
		'commitizen tutorial',
		'automated changelog conventional commits',
	],
}

export class YouTubeService {
	private static instance: YouTubeService
	private cache: Map<string, YouTubeSearchResponse> = new Map()

	static getInstance(): YouTubeService {
		if (!YouTubeService.instance) {
			YouTubeService.instance = new YouTubeService()
		}
		return YouTubeService.instance
	}

	async searchVideos(
		moduleId: string,
		maxResults: number = 5,
	): Promise<YouTubeSearchResponse> {
		// Check cache first
		const cacheKey = `${moduleId}-${maxResults}`
		if (this.cache.has(cacheKey)) {
			return this.cache.get(cacheKey)!
		}

		const searchTerms = MODULE_SEARCH_TERMS[moduleId] || [
			'conventional commits',
		]
		const searchQuery = searchTerms.join(' OR ')

		try {
			// Check if API key is valid
			if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'YOUR_YOUTUBE_API_KEY') {
				console.warn('YouTube API key not configured - Using fallback data')
				return this.getMockVideos(moduleId)
			}

			const response = await fetch(
				`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
					searchQuery,
				)}&type=video&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}&order=relevance`,
			)

			if (!response.ok) {
				const errorText = await response.text()
				console.warn(`YouTube API error: ${response.status} - ${errorText}`)

				// Handle specific error cases
				if (response.status === 403) {
					console.warn(
						'YouTube API 403: Check if API key is valid and YouTube Data API v3 is enabled',
					)
				} else if (response.status === 429) {
					console.warn('YouTube API 429: Quota exceeded')
				}

				// Return mock data for development/API issues
				return this.getMockVideos(moduleId)
			}

			const data = await response.json()

			// Check if we have valid data
			if (!data.items || data.items.length === 0) {
				console.warn('No YouTube videos found - Using fallback data')
				return this.getMockVideos(moduleId)
			}

			const videos: YouTubeVideo[] = data.items.map(
				(item: {
					id: { videoId: string }
					snippet: {
						title: string
						description: string
						thumbnails: {
							medium?: { url: string }
							default?: { url: string }
						}
						channelTitle: string
						publishedAt: string
					}
				}) => ({
					id: item.id.videoId,
					title: item.snippet.title,
					description: item.snippet.description,
					thumbnail:
						item.snippet.thumbnails.medium?.url ||
						item.snippet.thumbnails.default?.url,
					duration: 'Unknown', // Duration requires additional API call
					channelTitle: item.snippet.channelTitle,
					publishedAt: item.snippet.publishedAt,
					viewCount: 'Unknown', // View count requires additional API call
					url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
				}),
			)

			const result: YouTubeSearchResponse = {
				videos,
				totalResults: data.pageInfo.totalResults,
			}

			// Cache the result
			this.cache.set(cacheKey, result)

			return result
		} catch (error) {
			console.error('Error fetching YouTube videos:', error)
			// Return mock data for development
			return this.getMockVideos(moduleId)
		}
	}

	private getMockVideos(moduleId: string): YouTubeSearchResponse {
		const moduleVideos: Record<string, YouTubeVideo[]> = {
			introduction: [
				{
					id: 'dQw4w9WgXcQ', // Rick Roll - Always works
					title: 'Conventional Commits Tutorial - Complete Guide',
					description:
						'Learn the fundamentals of conventional commits with practical examples and real-world scenarios',
					thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
					duration: '3:32', // Actual Rick Roll duration
					channelTitle: 'Git Best Practices',
					publishedAt: '2024-01-15T10:00:00Z',
					viewCount: '125000',
					url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
				},
				{
					id: 'jNQXAC9IVRw', // Always works
					title: 'Git Commit Messages That Matter',
					description:
						'How to write meaningful commit messages that improve your development workflow',
					thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/mqdefault.jpg',
					duration: '3:32', // Actual duration
					channelTitle: 'Dev Tutorials',
					publishedAt: '2024-01-10T14:30:00Z',
					viewCount: '89000',
					url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
				},
				{
					id: 'abc123def456', // Unique ID for third video
					title: 'Semantic Versioning with Conventional Commits',
					description:
						'Understanding how conventional commits enable automated versioning and changelog generation',
					thumbnail: 'https://img.youtube.com/vi/abc123def456/mqdefault.jpg',
					duration: '15:20',
					channelTitle: 'Version Control Mastery',
					publishedAt: '2024-01-05T09:15:00Z',
					viewCount: '67000',
					url: 'https://www.youtube.com/watch?v=abc123def456',
				},
			],
			types: [
				{
					id: 'def456ghi789', // Unique ID
					title: 'Git Commit Types: feat, fix, docs, and more',
					description:
						'Master all conventional commit types with examples and best practices',
					thumbnail: 'https://img.youtube.com/vi/def456ghi789/mqdefault.jpg',
					duration: '18:15',
					channelTitle: 'Git Fundamentals',
					publishedAt: '2024-01-20T11:00:00Z',
					viewCount: '95000',
					url: 'https://www.youtube.com/watch?v=def456ghi789',
				},
				{
					id: 'ghi789jkl012', // Unique ID
					title: 'When to Use Each Commit Type',
					description:
						'Learn the decision-making process for choosing the right commit type',
					thumbnail: 'https://img.youtube.com/vi/ghi789jkl012/mqdefault.jpg',
					duration: '14:30',
					channelTitle: 'Code Quality Hub',
					publishedAt: '2024-01-18T16:45:00Z',
					viewCount: '78000',
					url: 'https://www.youtube.com/watch?v=ghi789jkl012',
				},
			],
			'team-workflow': [
				{
					id: 'jkl012mno345', // Unique ID
					title: 'Setting Up Conventional Commits for Your Team',
					description:
						'Complete guide to implementing conventional commits across your development team',
					thumbnail: 'https://img.youtube.com/vi/jkl012mno345/mqdefault.jpg',
					duration: '22:10',
					channelTitle: 'Team Development',
					publishedAt: '2024-01-25T13:20:00Z',
					viewCount: '112000',
					url: 'https://www.youtube.com/watch?v=jkl012mno345',
				},
				{
					id: 'mno345pqr678', // Unique ID
					title: 'Automated Changelog Generation',
					description:
						'How to set up automated changelog generation using conventional commits',
					thumbnail: 'https://img.youtube.com/vi/mno345pqr678/mqdefault.jpg',
					duration: '16:45',
					channelTitle: 'DevOps Simplified',
					publishedAt: '2024-01-22T10:30:00Z',
					viewCount: '85000',
					url: 'https://www.youtube.com/watch?v=mno345pqr678',
				},
			],
		}

		const videos = moduleVideos[moduleId] || [
			{
				id: 'default123',
				title: `Conventional Commits: ${moduleId} Module`,
				description:
					'Learn conventional commits with practical examples and real-world scenarios',
				thumbnail: 'https://img.youtube.com/vi/default123/mqdefault.jpg',
				duration: '10:00',
				channelTitle: 'Git Tutorials',
				publishedAt: '2024-01-01T00:00:00Z',
				viewCount: '50000',
				url: 'https://www.youtube.com/watch?v=default123',
			},
		]

		return {
			videos,
			totalResults: videos.length,
		}
	}

	clearCache(): void {
		this.cache.clear()
	}
}

export const youtubeService = YouTubeService.getInstance()
