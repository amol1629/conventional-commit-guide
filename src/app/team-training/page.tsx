'use client'

import AnimatedBackground from '@/components/AnimatedBackground'
import Layout from '@/components/Layout'
import ProtectedRoute from '@/components/ProtectedRoute'
import StatsDashboard from '@/components/team-training/StatsDashboard'
import { TeamTrainingCMS } from '@/components/TeamTrainingCMS'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { YouTubePlayer } from '@/components/YouTubePlayer'
import { useAuth } from '@/contexts/AuthContext'
import {
	EnhancedTrainingModule,
	enhancedTrainingModules,
} from '@/data/enhanced-training-modules'
import { useTeamTrainingTracker } from '@/hooks/useTeamTrainingTracker'
import { databaseProgressService } from '@/services/database-progress.service'
import { youtubeService, YouTubeVideo } from '@/services/youtube.service'
import { Achievement, LearningStats } from '@/types/database'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Use enhanced training modules
const trainingModules = enhancedTrainingModules

const teamResources = [
	{
		title: 'Commit Message Templates',
		description: 'Pre-configured templates for common commit types',
		icon: 'FileText',
		download: 'Download Templates',
	},
	{
		title: 'Team Guidelines Document',
		description: 'Comprehensive guide for your development team',
		icon: 'Book',
		download: 'Download Guidelines',
	},
	{
		title: 'Git Hooks Setup',
		description: 'Pre-commit hooks to enforce conventional commits',
		icon: 'GitBranch',
		download: 'Download Hooks',
	},
	{
		title: 'Changelog Generator Config',
		description: 'Configuration for automated changelog generation',
		icon: 'FileCode',
		download: 'Download Config',
	},
]

export default function TeamTraining() {
	const { authState } = useAuth()
	const {
		trackModuleSelection,
		trackVideoSelection,
		trackModuleProgress: trackDetailedModuleProgress,
		trackModuleCompletion,
		trackUserInteraction,
	} = useTeamTrainingTracker()
	const [selectedModule, setSelectedModule] = useState<EnhancedTrainingModule>(
		trainingModules[0],
	)
	const [completedModules, setCompletedModules] = useState<string[]>([])
	const [showVideoModal, setShowVideoModal] = useState(false)
	const [videos, setVideos] = useState<YouTubeVideo[]>([])
	const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | undefined>()
	const [learningStats, setLearningStats] = useState<LearningStats>({
		userId: authState.user?.id || '',
		totalModules: 0,
		completedModules: 0,
		totalProgress: 0,
		totalTimeSpent: 0,
		streak: 0,
		lastActivity: new Date(),
		achievements: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	})

	// Load learning stats on component mount
	useEffect(() => {
		if (authState.user?.id) {
			// Set user ID for database service
			databaseProgressService.setUserId(authState.user.id)

			// Load learning stats from database
			const loadStats = async () => {
				try {
					const stats = await databaseProgressService.getLearningStats()
					setLearningStats(stats)

					// Load progress for each module from database
					const progress: Record<string, number> = {}
					for (const trainingModule of trainingModules) {
						const moduleProgress =
							await databaseProgressService.getModuleProgress(trainingModule.id)
						progress[trainingModule.id] = moduleProgress?.progress || 0
					}
				} catch (error) {
					console.error('Error loading stats:', error)
				}
			}

			loadStats()
		}
	}, [authState.user?.id])

	const markAsCompleted = (moduleId: string) => {
		if (!completedModules.includes(moduleId)) {
			setCompletedModules([...completedModules, moduleId])
		}
	}

	const handleModuleClick = async (module: EnhancedTrainingModule) => {
		setSelectedModule(module)
		setShowVideoModal(true)

		try {
			const videoResults = await youtubeService.searchVideos(module.id, 5)
			setVideos(videoResults.videos)

			// Save videos to database for tracking
			for (const video of videoResults.videos) {
				try {
					await fetch('/api/videos', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							videoId: video.id,
							title: video.title,
							description: video.description,
							channelTitle: video.channelTitle,
							viewCount: video.viewCount,
							publishedAt: video.publishedAt,
							duration: video.duration,
							moduleId: module.id,
							category: 'tutorial',
							thumbnail: video.thumbnail,
							tags: [module.id, 'tutorial', 'git'],
						}),
					})
				} catch (error) {
					console.error('Error saving video to database:', error)
				}
			}
		} catch (error) {
			console.error('Error loading videos:', error)
			setVideos([])
		}
	}

	const handleVideoSelect = async (video: YouTubeVideo) => {
		setSelectedVideo(video)

		// Track comprehensive video selection
		try {
			// Track module selection if not already tracked
			await trackModuleSelection(selectedModule.id, selectedModule.title, {
				moduleLevel: selectedModule.level,
				moduleDuration: selectedModule.duration,
			})

			// Track video selection with detailed metadata
			await trackVideoSelection(
				selectedModule.id,
				selectedModule.title,
				video.id,
				video.title,
				Number(video.duration) || 0,
				{
					videoChannel: video.channelTitle,
					videoViews: video.viewCount,
					videoPublishedAt: video.publishedAt,
					videoDescription: video.description,
				},
			)

			// Also track in learning history
			await fetch('/api/learning-history', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: authState.user?.id,
					activityType: 'video_selected',
					moduleId: selectedModule.id,
					moduleTitle: selectedModule.title,
					progress: 0,
					timeSpent: 0,
					metadata: {
						videoId: video.id,
						videoTitle: video.title,
						videoChannel: video.channelTitle,
						videoViews: video.viewCount,
						videoDuration: video.duration,
						selectionTime: new Date().toISOString(),
					},
				}),
			})

			// Track user interaction
			await trackUserInteraction(
				selectedModule.id,
				selectedModule.title,
				'video_selection',
				{
					videoId: video.id,
					videoTitle: video.title,
				},
			)
		} catch (error) {
			console.error('Error tracking video selection:', error)
		}
	}

	const handleProgressUpdate = async (progress: number) => {
		try {
			await databaseProgressService.updateModuleProgress(
				selectedModule.id,
				selectedModule.title,
				progress,
			)

			// Track comprehensive progress updates
			if (progress === 100) {
				// Track module completion with detailed metadata
				await trackModuleCompletion(
					selectedModule.id,
					selectedModule.title,
					100,
					Number(selectedModule.duration) || 0,
				)

				// Track user interaction for completion
				await trackUserInteraction(
					selectedModule.id,
					selectedModule.title,
					'module_completion',
					{
						completionPercentage: progress,
						completionTime: new Date().toISOString(),
					},
				)
			} else {
				// Track detailed module progress
				await trackDetailedModuleProgress(
					selectedModule.id,
					selectedModule.title,
					progress,
					{
						updatedAt: new Date().toISOString(),
						progressMilestone:
							progress >= 25
								? 'quarter'
								: progress >= 50
								? 'half'
								: progress >= 75
								? 'three_quarters'
								: 'started',
					},
				)

				// Track user interaction for progress
				await trackUserInteraction(
					selectedModule.id,
					selectedModule.title,
					'progress_update',
					{
						progressPercentage: progress,
						updateTime: new Date().toISOString(),
					},
				)
			}

			// Update local state

			// Update learning stats
			const stats = await databaseProgressService.getLearningStats()
			setLearningStats(stats)

			// Mark as completed if 100%
			if (progress >= 100) {
				markAsCompleted(selectedModule.id)
			}
		} catch (error) {
			console.error('Error updating progress:', error)
		}
	}

	const handleAchievementClick = (achievement: Achievement) => {
		// Show achievement details or celebration
		console.log('Achievement clicked:', achievement)
	}

	const getLevelColor = (level: string) => {
		switch (level) {
			case 'Beginner':
				return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
			case 'Intermediate':
				return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
			case 'Advanced':
				return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
			default:
				return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
		}
	}

	return (
		<ProtectedRoute>
			<Layout>
				<AnimatedBackground className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800">
					<div className="container px-6 py-12 mx-auto">
						{/* Header */}
						<div className="mb-12 text-center">
							<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-purple-700 bg-purple-100 rounded-full animate-fade-in dark:text-purple-300 dark:bg-purple-900/30">
								<div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
								Team Training
							</div>
							<h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white animate-slide-up">
								Team Training
							</h1>
							<p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300 animate-slide-up">
								Comprehensive training materials and resources to help your
								entire team adopt conventional commit standards and improve
								collaboration.
							</p>
						</div>

						{/* Progress Overview */}
						<Card className="mb-8">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									{getFontAwesomeIcon('TrendingUp', 'w-6 h-6 text-blue-500')}
									Training Progress
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between mb-4">
									<span className="text-lg font-medium">
										Completed: {completedModules.length} /{' '}
										{trainingModules.length} modules
									</span>
									<Badge variant="outline" className="px-4 py-2 text-lg">
										{Math.round(
											(completedModules.length / trainingModules.length) * 100,
										)}
										%
									</Badge>
								</div>
								<div className="w-full h-3 bg-gray-200 rounded-full dark:bg-gray-700">
									<div
										className="h-3 transition-all duration-300 bg-blue-600 rounded-full"
										style={{
											width: `${
												(completedModules.length / trainingModules.length) * 100
											}%`,
										}}
									></div>
								</div>
							</CardContent>
						</Card>

						{/* Learning Stats Dashboard */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									{getFontAwesomeIcon('BarChart3', 'w-6 h-6 text-green-500')}
									Learning Progress Dashboard
								</CardTitle>
								<CardDescription>
									Track your team&apos;s learning progress and achievements
								</CardDescription>
							</CardHeader>
							<CardContent>
								<StatsDashboard
									stats={learningStats}
									onAchievementClick={handleAchievementClick}
								/>
							</CardContent>
						</Card>

						<div className="grid gap-8 lg:grid-cols-3">
							{/* Training Modules */}
							<div className="lg:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											{getFontAwesomeIcon(
												'GraduationCap',
												'w-6 h-6 text-purple-500',
											)}
											Training Modules
										</CardTitle>
										<CardDescription>
											Interactive training modules for your team
										</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="space-y-4">
											{trainingModules.map((module) => (
												<div
													key={module.id}
													className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
														selectedModule.id === module.id
															? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
															: 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
													} ${
														completedModules.includes(module.id)
															? 'bg-green-50 dark:bg-green-900/20'
															: ''
													}`}
													onClick={() => handleModuleClick(module)}
												>
													<div className="flex items-center justify-between">
														<div className="flex items-center gap-3">
															{getFontAwesomeIcon(
																module.icon,
																'w-6 h-6 text-blue-500',
															)}
															<div>
																<h3 className="font-semibold">
																	{module.title}
																</h3>
																<p className="text-sm text-gray-600 dark:text-gray-300">
																	{module.description}
																</p>
															</div>
														</div>
														<div className="flex items-center gap-2">
															<Badge className={getLevelColor(module.level)}>
																{module.level}
															</Badge>
															<Badge variant="outline">{module.duration}</Badge>
															{completedModules.includes(module.id) && (
																<Badge className="text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200">
																	{getFontAwesomeIcon('Check', 'w-3 h-3 mr-1')}
																	Completed
																</Badge>
															)}
														</div>
													</div>
												</div>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Module Content */}
							<div className="lg:col-span-1">
								<Card className="sticky top-8">
									<CardHeader>
										<CardTitle className="flex items-center gap-3">
											{getFontAwesomeIcon(
												selectedModule.icon,
												'w-6 h-6 text-green-500',
											)}
											{selectedModule.title}
										</CardTitle>
										<CardDescription>
											{selectedModule.description}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex gap-2">
											<Badge className={getLevelColor(selectedModule.level)}>
												{selectedModule.level}
											</Badge>
											<Badge variant="outline">{selectedModule.duration}</Badge>
										</div>

										<div className="space-y-4">
											<div>
												<h4 className="mb-2 font-semibold">Overview</h4>
												<p className="text-sm text-gray-600 dark:text-gray-300">
													{selectedModule.content.overview}
												</p>
											</div>

											{selectedModule.content.benefits && (
												<div>
													<h4 className="mb-2 font-semibold">Benefits</h4>
													<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
														{selectedModule.content.benefits.map(
															(benefit, index) => (
																<li key={index}>• {benefit}</li>
															),
														)}
													</ul>
												</div>
											)}

											{selectedModule.content.types && (
												<div>
													<h4 className="mb-2 font-semibold">Commit Types</h4>
													<div className="space-y-2">
														{selectedModule.content.types.map((type, index) => (
															<div key={index} className="text-sm">
																<code className="px-2 py-1 mr-2 text-xs bg-gray-100 rounded dark:bg-gray-700">
																	{type.type}
																</code>
																<span className="text-gray-600 dark:text-gray-300">
																	{type.description}
																</span>
																<div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
																	Example: {type.example}
																</div>
															</div>
														))}
													</div>
												</div>
											)}

											{selectedModule.content.bestPractices && (
												<div>
													<h4 className="mb-2 font-semibold">Best Practices</h4>
													<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
														{selectedModule.content.bestPractices.map(
															(practice, index) => (
																<li key={index}>• {practice}</li>
															),
														)}
													</ul>
												</div>
											)}

											{selectedModule.content.examples && (
												<div>
													<h4 className="mb-2 font-semibold">Examples</h4>
													<div className="space-y-2">
														{selectedModule.content.examples.map(
															(example, index) => (
																<div
																	key={index}
																	className="p-2 text-sm rounded bg-gray-50 dark:bg-gray-800"
																>
																	<code>{example}</code>
																</div>
															),
														)}
													</div>
												</div>
											)}
										</div>

										<Button
											className="w-full"
											onClick={() => markAsCompleted(selectedModule.id)}
											disabled={completedModules.includes(selectedModule.id)}
										>
											{completedModules.includes(selectedModule.id) ? (
												<>
													{getFontAwesomeIcon('Check', 'w-4 h-4 mr-2')}
													Completed
												</>
											) : (
												<>
													{getFontAwesomeIcon('CheckCircle', 'w-4 h-4 mr-2')}
													Mark as Completed
												</>
											)}
										</Button>
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Team Resources */}
						<Card className="mt-12">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									{getFontAwesomeIcon('Download', 'w-6 h-6 text-indigo-500')}
									Team Resources
								</CardTitle>
								<CardDescription>
									Downloadable resources to help implement conventional commits
									in your team
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
									{teamResources.map((resource, index) => (
										<Card key={index} className="text-center">
											<CardContent className="pt-6">
												<div className="flex justify-center mb-4">
													{getFontAwesomeIcon(
														resource.icon,
														'w-8 h-8 text-indigo-500',
													)}
												</div>
												<h3 className="mb-2 font-semibold">{resource.title}</h3>
												<p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
													{resource.description}
												</p>
												<Button variant="outline" size="sm" className="w-full">
													{getFontAwesomeIcon('Download', 'w-4 h-4 mr-2')}
													{resource.download}
												</Button>
											</CardContent>
										</Card>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Learning Management System */}
						<Card className="mt-8">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									{getFontAwesomeIcon('ChartBar', 'w-6 h-6 text-purple-500')}
									Learning Management System
								</CardTitle>
								<CardDescription>
									Track your learning progress, bookmarks, notes, and
									achievements
								</CardDescription>
							</CardHeader>
							<CardContent>
								<TeamTrainingCMS />
							</CardContent>
						</Card>

						{/* Implementation Guide */}
						<Card className="mt-8">
							<CardHeader>
								<CardTitle className="flex items-center gap-3">
									{getFontAwesomeIcon('Rocket', 'w-6 h-6 text-orange-500')}
									Implementation Guide
								</CardTitle>
							</CardHeader>
							<CardContent>
								<Tabs defaultValue="setup" className="w-full">
									<TabsList className="grid w-full grid-cols-4 rounded-full">
										<TabsTrigger
											className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
											value="setup"
										>
											Setup
										</TabsTrigger>
										<TabsTrigger
											className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
											value="tools"
										>
											Tools
										</TabsTrigger>
										<TabsTrigger
											className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
											value="workflow"
										>
											Workflow
										</TabsTrigger>
										<TabsTrigger
											className="transition-colors rounded-full hover:bg-accent hover:text-accent-foreground"
											value="maintenance"
										>
											Maintenance
										</TabsTrigger>
									</TabsList>

									<TabsContent value="setup" className="space-y-4">
										<h4 className="font-semibold">Initial Setup</h4>
										<ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
											<li>1. Install commitizen and husky</li>
											<li>2. Configure pre-commit hooks</li>
											<li>3. Set up automated changelog generation</li>
											<li>4. Train team on commit message standards</li>
										</ol>
									</TabsContent>

									<TabsContent value="tools" className="space-y-4">
										<h4 className="font-semibold">Recommended Tools</h4>
										<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
											<li>• Commitizen for interactive commit creation</li>
											<li>• Husky for pre-commit hooks</li>
											<li>• Conventional Changelog for automated changelogs</li>
											<li>• Semantic Release for automated versioning</li>
										</ul>
									</TabsContent>

									<TabsContent value="workflow" className="space-y-4">
										<h4 className="font-semibold">Team Workflow</h4>
										<ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
											<li>1. Developer creates feature branch</li>
											<li>
												2. Makes changes and commits with conventional format
											</li>
											<li>3. Pre-commit hooks validate commit message</li>
											<li>4. Creates pull request with conventional title</li>
											<li>5. Automated changelog and versioning on merge</li>
										</ol>
									</TabsContent>

									<TabsContent value="maintenance" className="space-y-4">
										<h4 className="font-semibold">Ongoing Maintenance</h4>
										<ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
											<li>• Regular team training sessions</li>
											<li>• Monitor commit message quality</li>
											<li>• Update tools and dependencies</li>
											<li>• Gather feedback and improve process</li>
										</ul>
									</TabsContent>
								</Tabs>
							</CardContent>
						</Card>
					</div>

					{/* Video Modal */}
					{showVideoModal && (
						<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
							<div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
								<div className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h2 className="text-2xl font-bold text-gray-900">
												{selectedModule.title}
											</h2>
											<p className="mt-1 text-gray-600">
												{selectedModule.description}
											</p>
										</div>
										<Button
											variant="outline"
											onClick={() => setShowVideoModal(false)}
											className="text-gray-500 hover:text-gray-700"
										>
											✕
										</Button>
									</div>

									{selectedVideo ? (
										<div className="space-y-4">
											<YouTubePlayer
												videoId={selectedVideo.id}
												moduleId={selectedModule.id}
												videoTitle={selectedVideo.title}
												videoUrl={`https://www.youtube.com/watch?v=${selectedVideo.id}`}
												thumbnail={selectedVideo.thumbnail}
												onVideoComplete={() => {
													handleProgressUpdate(100)
													trackModuleCompletion(
														selectedModule.id,
														selectedModule.title,
														100,
														Number(selectedModule.duration) || 0,
													)
												}}
											/>
										</div>
									) : (
										<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
											{videos.map((video) => (
												<Card
													key={video.id}
													className="transition-shadow cursor-pointer hover:shadow-lg"
													onClick={() => handleVideoSelect(video)}
												>
													<CardContent className="p-4">
														<Image
															src={video.thumbnail}
															alt={video.title}
															width={300}
															height={128}
															className="object-cover w-full h-32 mb-3 rounded"
														/>
														<h3 className="text-sm font-semibold line-clamp-2">
															{video.title}
														</h3>
														<p className="mt-1 text-xs text-gray-500">
															{video.channelTitle}
														</p>
													</CardContent>
												</Card>
											))}
										</div>
									)}
								</div>
							</div>
						</div>
					)}
				</AnimatedBackground>
			</Layout>
		</ProtectedRoute>
	)
}
