'use client'

import { Button } from '@/components/ui/button'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Link from 'next/link'

export function HeroSection() {
	return (
		<section
			className="relative px-4 py-16 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950"
			aria-labelledby="hero-title"
		>
			<div className="mx-auto max-w-7xl">
				<div className="space-y-4 sm:space-y-6 lg:space-y-8 text-center">
					<div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
						<div
							className="flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 shadow-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-emerald-500 dark:from-blue-600 dark:via-purple-600 dark:to-emerald-600 rounded-lg dark:shadow-blue-500/25 dark:shadow-2xl transition-all duration-300 hover:scale-110"
							role="img"
							aria-label="Git and GitHub integration icon"
						>
							<div className="flex items-center space-x-1 sm:space-x-2">
								{getFontAwesomeIcon(
									'GitCommit',
									'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-white dark:text-white',
								)}
								{getFontAwesomeIcon(
									'Github',
									'w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-white dark:text-white',
								)}
							</div>
						</div>
					</div>

					<h1
						id="hero-title"
						className="font-bold leading-tight text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 dark:text-white"
					>
						<span className="sr-only">
							Git Conventional Commits Practice -{' '}
						</span>
						<span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text">
							Git Conventional Commits Practice
						</span>
					</h1>

					<p
						id="hero-description"
						className="max-w-4xl mx-auto text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-gray-600 dark:text-gray-200 dark:text-opacity-90 px-4"
					>
						Master the art of writing meaningful commit messages with our
						comprehensive platform. Learn conventional commits, improve your Git
						workflow, and build better software development practices.
					</p>

					{/* <div className="flex flex-wrap justify-center gap-4 mt-8">
						<Badge variant="secondary" className="px-4 py-2 text-sm">
							{getFontAwesomeIcon('Users', 'w-4 h-4 mr-2')}
							Used by 10,000+ developers
						</Badge>
						<Badge variant="secondary" className="px-4 py-2 text-sm">
							{getFontAwesomeIcon('Star', 'w-4 h-4 mr-2')}
							Industry Standard
						</Badge>
						<Badge variant="secondary" className="px-4 py-2 text-sm">
							{getFontAwesomeIcon('Zap', 'w-4 h-4 mr-2')}
							Free & Open Source
						</Badge>
					</div> */}

					<div
						className="flex flex-col justify-center gap-3 sm:gap-4 mt-8 sm:mt-10 lg:mt-12 sm:flex-row"
						role="group"
						aria-label="Main navigation actions"
					>
						<Link href="/generator">
							<Button
								size="lg"
								className="px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 dark:focus:ring-blue-400 shadow-lg hover:shadow-xl dark:shadow-blue-500/25 dark:hover:shadow-blue-500/40 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 rounded-lg"
								aria-describedby="hero-description"
							>
								<span className="flex items-center">
									Start Practicing Now
									{getFontAwesomeIcon(
										'ArrowRight',
										'w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2',
									)}
								</span>
							</Button>
						</Link>
						<Link href="/examples">
							<Button
								variant="outline"
								size="lg"
								className="px-8 py-4 text-base font-semibold text-teal-700 bg-teal-50 border-2 border-teal-300 hover:bg-teal-100 hover:border-teal-400 hover:text-teal-800 focus:ring-4 focus:ring-teal-300 dark:text-teal-100 dark:bg-teal-900/30 dark:border-teal-400 dark:hover:bg-teal-900/40 dark:hover:border-teal-300 dark:hover:text-teal-50 dark:focus:ring-teal-400 shadow-lg hover:shadow-xl dark:shadow-teal-400/20 dark:hover:shadow-teal-400/30 w-full sm:w-auto transition-all duration-300 transform hover:scale-105 rounded-lg"
								aria-describedby="hero-description"
							>
								<span className="flex items-center">
									View Examples
									{getFontAwesomeIcon(
										'BookOpen',
										'w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2',
									)}
								</span>
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
