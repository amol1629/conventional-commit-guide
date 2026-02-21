'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import { useCallback, useEffect, useRef, useState } from 'react'

const benefits = [
	{
		icon: 'Play',
		title: 'Interactive Practice',
		description:
			'Practice writing conventional commits with real-world scenarios. Get instant feedback and learn from examples used by major open-source projects.',
		bgColor: 'bg-blue-100 dark:bg-blue-900',
		iconColor: 'text-blue-600 dark:text-blue-400',
	},
	{
		icon: 'CheckCircle',
		title: 'Commit Validator',
		description:
			'Validate your commit messages in real-time. Our intelligent validator checks format, type usage, and provides suggestions for improvement.',
		bgColor: 'bg-green-100 dark:bg-green-900',
		iconColor: 'text-green-600 dark:text-green-400',
	},
	{
		icon: 'Zap',
		title: 'Commit Generator',
		description:
			'Generate perfect conventional commits with our AI-powered generator. Just describe your changes and get properly formatted commit messages.',
		bgColor: 'bg-purple-100 dark:bg-purple-900',
		iconColor: 'text-purple-600 dark:text-purple-400',
	},
	{
		icon: 'Book',
		title: 'Comprehensive Guide',
		description:
			'Learn from detailed guides covering all commit types, scopes, and best practices. Master conventional commits with step-by-step tutorials.',
		bgColor: 'bg-orange-100 dark:bg-orange-900',
		iconColor: 'text-orange-600 dark:text-orange-400',
	},
	{
		icon: 'FileText',
		title: 'Changelog Generator',
		description:
			'Generate professional changelogs from your commit history. Create beautiful, formatted changelogs for your releases automatically.',
		bgColor: 'bg-cyan-100 dark:bg-cyan-900',
		iconColor: 'text-cyan-600 dark:text-cyan-400',
	},
	{
		icon: 'Star',
		title: 'Progress Tracking',
		description:
			'Track your learning progress with detailed analytics. See your improvement over time and identify areas for further development.',
		bgColor: 'bg-indigo-100 dark:bg-indigo-900',
		iconColor: 'text-indigo-600 dark:text-indigo-400',
	},
]

export function BenefitsSlider() {
	const sliderRef = useRef<HTMLDivElement>(null)
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isHovered, setIsHovered] = useState(false)
	const positionRef = useRef(0)

	const cardWidth = 384 // w-96 = 24rem = 384px
	const gap = 32 // gap-8 = 2rem = 32px
	const totalWidth = cardWidth + gap

	const goToSlide = useCallback(
		(index: number) => {
			if (!sliderRef.current) return

			setCurrentIndex(index)
			const newPosition = -index * totalWidth
			positionRef.current = newPosition
			sliderRef.current.style.transform = `translateX(${newPosition}px)`
		},
		[totalWidth],
	)

	// Handle infinite loop by resetting position when needed
	useEffect(() => {
		if (!sliderRef.current) return

		// If we're at the end of the first set, jump to the beginning of the second set
		if (currentIndex === benefits.length) {
			setCurrentIndex(0)
			positionRef.current = 0
			sliderRef.current.style.transform = `translateX(0px)`
		}
	}, [currentIndex])

	const nextSlide = useCallback(() => {
		const nextIndex = (currentIndex + 1) % benefits.length
		goToSlide(nextIndex)
	}, [currentIndex, goToSlide])

	const prevSlide = () => {
		const prevIndex =
			currentIndex === 0 ? benefits.length - 1 : currentIndex - 1
		goToSlide(prevIndex)
	}

	const handleMouseEnter = () => {
		setIsHovered(true)
	}

	const handleMouseLeave = () => {
		setIsHovered(false)
	}

	useEffect(() => {
		if (isHovered) return

		const interval = setInterval(() => {
			nextSlide()
		}, 3000) // Change slide every 3 seconds

		return () => clearInterval(interval)
	}, [isHovered, nextSlide])

	return (
		<section className="px-6 py-20 bg-gradient-to-r from-blue-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700">
			<div className="mx-auto max-w-7xl">
				<div className="mb-16 text-center">
					<h2 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white">
						What You&apos;ll Get
					</h2>
					<p className="max-w-3xl mx-auto text-xl text-gray-600 dark:text-gray-300">
						Master conventional commits with our comprehensive toolkit designed
						for developers of all skill levels
					</p>
				</div>

				<div className="relative">
					{/* Gradient overlays for better button visibility */}
					<div className="absolute top-0 bottom-0 left-0 z-10 w-20 pointer-events-none bg-gradient-to-r from-blue-50/80 to-transparent dark:from-gray-800/80" />
					<div className="absolute top-0 bottom-0 right-0 z-10 w-20 pointer-events-none bg-gradient-to-l from-blue-50/80 to-transparent dark:from-gray-800/80" />

					{/* Left Arrow - Left side */}
					<div className="absolute z-20 -translate-y-1/2 left-4 top-1/2">
						<Button
							variant="outline"
							size="sm"
							onClick={prevSlide}
							className="w-12 h-12 transition-all duration-200 border-2 border-blue-200 rounded-full shadow-xl bg-white/95 hover:bg-white hover:border-blue-300 hover:scale-110 backdrop-blur-sm"
						>
							{getFontAwesomeIcon('ChevronLeft', 'w-5 h-5 text-blue-600')}
						</Button>
					</div>

					{/* Right Arrow - Right side */}
					<div className="absolute z-20 -translate-y-1/2 right-4 top-1/2">
						<Button
							variant="outline"
							size="sm"
							onClick={nextSlide}
							className="w-12 h-12 transition-all duration-200 border-2 border-blue-200 rounded-full shadow-xl bg-white/95 hover:bg-white hover:border-blue-300 hover:scale-110 backdrop-blur-sm"
						>
							{getFontAwesomeIcon('ChevronRight', 'w-5 h-5 text-blue-600')}
						</Button>
					</div>

					{/* Slider Container */}
					<div
						className="relative mx-20 overflow-hidden"
						onMouseEnter={handleMouseEnter}
						onMouseLeave={handleMouseLeave}
					>
						<div
							ref={sliderRef}
							className="flex gap-8 transition-transform duration-500 ease-in-out"
							style={{ width: 'max-content' }}
						>
							{/* First set of cards */}
							{benefits.map((benefit, index) => (
								<Card
									key={`first-${index}`}
									className="flex-shrink-0 p-8 text-center transition-all duration-300 w-96 hover:shadow-xl hover:scale-105"
								>
									<div
										className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full ${benefit.bgColor}`}
									>
										{getFontAwesomeIcon(
											benefit.icon,
											`w-8 h-8 ${benefit.iconColor}`,
										)}
									</div>
									<h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
										{benefit.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300">
										{benefit.description}
									</p>
								</Card>
							))}
							{/* Duplicate set for seamless loop */}
							{benefits.map((benefit, index) => (
								<Card
									key={`second-${index}`}
									className="flex-shrink-0 p-8 text-center transition-all duration-300 w-96 hover:shadow-xl hover:scale-105"
								>
									<div
										className={`flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full ${benefit.bgColor}`}
									>
										{getFontAwesomeIcon(
											benefit.icon,
											`w-8 h-8 ${benefit.iconColor}`,
										)}
									</div>
									<h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
										{benefit.title}
									</h3>
									<p className="text-gray-600 dark:text-gray-300">
										{benefit.description}
									</p>
								</Card>
							))}
						</div>
					</div>

					{/* Dots Indicator */}
					<div className="flex justify-center gap-2 mt-8">
						{benefits.map((_, index) => (
							<button
								key={index}
								onClick={() => goToSlide(index)}
								className={`w-3 h-3 rounded-full transition-all duration-300 ${
									index === currentIndex
										? 'bg-blue-600 scale-125'
										: 'bg-gray-300 hover:bg-gray-400'
								}`}
								aria-label={`Go to slide ${index + 1}`}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
