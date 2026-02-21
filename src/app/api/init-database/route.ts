import { getDatabase } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function POST() {
	try {
		const db = await getDatabase()

		// Create learningHistory collection with proper indexes
		await db
			.collection('learningHistory')
			.createIndex({ userId: 1, timestamp: -1 })
		await db.collection('learningHistory').createIndex({ activityType: 1 })
		await db.collection('learningHistory').createIndex({ moduleId: 1 })

		// Create videos collection for tracking all videos
		await db.collection('videos').createIndex({ videoId: 1 }, { unique: true })
		await db.collection('videos').createIndex({ moduleId: 1 })
		await db.collection('videos').createIndex({ category: 1 })

		// Create userVideoProgress collection for detailed video tracking
		await db
			.collection('userVideoProgress')
			.createIndex({ userId: 1, videoId: 1 }, { unique: true })
		await db
			.collection('userVideoProgress')
			.createIndex({ userId: 1, moduleId: 1 })
		await db.collection('userVideoProgress').createIndex({ lastWatched: -1 })

		// Create commitsPractice collection for tracking commit practice sessions
		await db
			.collection('commitsPractice')
			.createIndex({ userId: 1, timestamp: -1 })
		await db.collection('commitsPractice').createIndex({ moduleId: 1 })
		await db.collection('commitsPractice').createIndex({ success: 1 })

		// Create learningSessions collection for session tracking
		await db
			.collection('learningSessions')
			.createIndex({ userId: 1, startTime: -1 })
		await db
			.collection('learningSessions')
			.createIndex({ sessionId: 1 }, { unique: true })

		// Seed some sample videos
		const sampleVideos = [
			{
				videoId: 'dQw4w9WgXcQ',
				title: 'Git Basics Tutorial',
				description: 'Learn the fundamentals of Git version control',
				channelTitle: 'GitHub',
				viewCount: 1000000,
				publishedAt: '2023-01-15T00:00:00Z',
				duration: 1800, // 30 minutes in seconds
				moduleId: 'git-basics',
				category: 'tutorial',
				thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
				tags: ['git', 'basics', 'tutorial'],
			},
			{
				videoId: 'abc123def456',
				title: 'Conventional Commits Explained',
				description: 'Master the art of writing conventional commit messages',
				channelTitle: 'DevOps Academy',
				viewCount: 500000,
				publishedAt: '2023-02-20T00:00:00Z',
				duration: 1200, // 20 minutes in seconds
				moduleId: 'commit-messages',
				category: 'tutorial',
				thumbnail: 'https://img.youtube.com/vi/abc123def456/maxresdefault.jpg',
				tags: ['commits', 'conventional', 'git'],
			},
			{
				videoId: 'xyz789uvw012',
				title: 'Git Workflow Best Practices',
				description: 'Learn professional Git workflows for team collaboration',
				channelTitle: 'Team Training',
				viewCount: 750000,
				publishedAt: '2023-03-10T00:00:00Z',
				duration: 2400, // 40 minutes in seconds
				moduleId: 'git-workflow',
				category: 'workflow',
				thumbnail: 'https://img.youtube.com/vi/xyz789uvw012/maxresdefault.jpg',
				tags: ['workflow', 'team', 'collaboration'],
			},
		]

		// Insert sample videos
		for (const video of sampleVideos) {
			await db
				.collection('videos')
				.replaceOne({ videoId: video.videoId }, video, { upsert: true })
		}

		return NextResponse.json({
			success: true,
			message:
				'Database initialized successfully with proper tables and indexes',
			data: {
				collections: [
					'learningHistory',
					'videos',
					'userVideoProgress',
					'commitsPractice',
					'learningSessions',
				],
				sampleVideos: sampleVideos.length,
			},
		})
	} catch (error) {
		console.error('Error initializing database:', error)
		return NextResponse.json(
			{ success: false, error: 'Failed to initialize database' },
			{ status: 500 },
		)
	}
}
