'use client'

import { FeatureCard } from '@/components/ui/feature-card'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const features = [
	{
		href: '/guide',
		variant: 'orange' as const,
		icon: 'Book',
		title: 'Complete Guide',
		description:
			'Master conventional commits with our comprehensive guide covering all commit types, best practices, and real-world examples.',
	},
	{
		href: '/generator',
		variant: 'lime' as const,
		icon: 'Zap',
		title: 'Smart Generator',
		description:
			'Generate perfect commit messages automatically. Our AI-powered tool suggests conventional commits based on your changes.',
	},
	{
		href: '/validator',
		variant: 'red' as const,
		icon: 'CheckCircle',
		title: 'Commit Validator',
		description:
			'Validate your commit messages against conventional commit standards. Get instant feedback and suggestions for improvement.',
	},
	{
		href: '/interactive-practice',
		variant: 'blue' as const,
		icon: 'Play',
		title: 'Interactive Practice',
		description:
			'Practice with real scenarios. Interactive exercises help you master conventional commits through hands-on learning.',
	},
	{
		href: '/examples',
		variant: 'green' as const,
		icon: 'BookOpen',
		title: 'Real Examples',
		description:
			'Browse hundreds of real-world commit examples from popular open-source projects. Learn from the best practices.',
	},
	{
		href: '/changelog',
		variant: 'cyan' as const,
		icon: 'FileText',
		title: 'Auto Changelog',
		description:
			'Generate beautiful changelogs automatically from your conventional commits. Perfect for releases and documentation.',
	},
	{
		href: '/team-training',
		variant: 'indigo' as const,
		icon: 'Users',
		title: 'Team Training',
		description:
			'Train your entire team on conventional commits. Comprehensive learning paths and progress tracking for teams.',
	},
	{
		href: '/git-guide',
		variant: 'purple' as const,
		icon: 'Github',
		title: 'Git & GitHub Guide',
		description:
			'Master Git fundamentals alongside conventional commits. Complete guide to version control best practices.',
	},
]

export function FeaturesSection() {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isHovered, setIsHovered] = useState(false)
	const [isTransitioning, setIsTransitioning] = useState(false)

	// Auto-play functionality
	useEffect(() => {
		if (isHovered) return

		const interval = setInterval(() => {
			setIsTransitioning(true)
			setCurrentIndex((prev) => (prev + 1) % features.length)

			// Reset transition state after animation completes
			setTimeout(() => setIsTransitioning(false), 300)
		}, 3000)

		return () => clearInterval(interval)
	}, [isHovered])

	const goToSlide = (index: number) => {
		if (index === currentIndex) return

		setIsTransitioning(true)
		setCurrentIndex(index)

		// Reset transition state after animation completes
		setTimeout(() => setIsTransitioning(false), 300)
	}

	// Get visible cards (current and adjacent ones)
	const getVisibleCards = () => {
		const visible = []
		for (let i = -1; i <= 1; i++) {
			const index = (currentIndex + i + features.length) % features.length
			visible.push({ ...features[index], position: i })
		}
		return visible
	}

	return (
		<section
			className="py-20 bg-white sm:py-24 lg:py-20 dark:bg-slate-950"
			aria-labelledby="features-title"
		>
			<div className="container px-4 mx-auto sm:px-6 lg:px-8">
				{/* Header */}
				<div className="mb-12 text-center sm:mb-16 lg:mb-20">
					<h2
						id="features-title"
						className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl lg:text-6xl dark:text-white"
					>
						<span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text">
							Everything You Need to Master Conventional Commits
						</span>
					</h2>
					<p className="max-w-4xl mx-auto text-xl text-gray-600 dark:text-gray-200 dark:text-opacity-90">
						From learning the basics to advanced team workflows, our
						comprehensive platform has everything you need to implement
						conventional commits in your projects.
					</p>
				</div>

				{/* Responsive Materio Carousel */}
				<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
					<div
						className="relative overflow-visible materio-carousel"
						onMouseEnter={() => setIsHovered(true)}
						onMouseLeave={() => setIsHovered(false)}
						role="region"
						aria-label="Feature cards carousel"
						aria-live="polite"
					>
						{/* Carousel Container - Responsive */}
						<div className="flex items-center justify-center gap-2 sm:gap-4 lg:gap-6">
							{getVisibleCards().map((feature, index) => (
								<div
									key={`${feature.href}-${currentIndex}-${index}`}
									className={`carousel-transition ${
										feature.position === 0
											? 'center-card'
											: feature.position === -1
											? 'left-card'
											: 'right-card'
									} ${
										isTransitioning && feature.position === 0
											? 'center-card-transition'
											: ''
									}`}
								>
									<Link
										href={feature.href}
										className="block w-72 h-60 sm:w-80 sm:h-66 lg:w-80 lg:h-66"
									>
										<FeatureCard
											variant={
												feature.variant as
													| 'orange'
													| 'lime'
													| 'red'
													| 'blue'
													| 'green'
													| 'purple'
													| 'cyan'
													| 'indigo'
													| 'sky'
											}
											icon={feature.icon}
											title={feature.title}
											description={feature.description}
											className="w-full h-full"
										/>
									</Link>
								</div>
							))}
						</div>

						{/* Pagination Dots */}
						<div
							className="flex justify-center mt-8 space-x-2"
							role="tablist"
							aria-label="Carousel navigation"
						>
							{features.map((_, index) => (
								<button
									key={index}
									onClick={() => goToSlide(index)}
									className={`carousel-dot h-2 w-2 rounded-full transition-all duration-300 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-400 ${
										index === currentIndex
											? 'active bg-blue-600 dark:bg-blue-400 dark:shadow-lg dark:shadow-blue-400/50'
											: 'bg-gray-300 hover:bg-gray-400 dark:bg-slate-600 dark:hover:bg-slate-500 dark:border dark:border-slate-500'
									}`}
									role="tab"
									aria-selected={index === currentIndex}
									aria-label={`Go to slide ${index + 1} of ${features.length}`}
									tabIndex={index === currentIndex ? 0 : -1}
								/>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	)
	
}
