'use client'

import { Button } from '@/components/ui/button'
import { getFontAwesomeIcon } from '@/utils/fontawesome-mapping'
import Link from 'next/link'

export function CTASection() {
	return (
		<section
			className="px-4 py-20 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-slate-950 dark:to-slate-900"
			aria-labelledby="cta-title"
		>
			<div className="max-w-4xl mx-auto text-center">
				<h2
					id="cta-title"
					className="mb-4 text-2xl font-bold text-white sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl"
				>
					<span className="text-white dark:text-transparent dark:bg-gradient-to-r dark:from-blue-300 dark:via-purple-300 dark:to-emerald-300 dark:bg-clip-text">
						Ready to Transform Your Git Workflow?
					</span>
				</h2>
				<p
					id="cta-description"
					className="max-w-3xl px-4 mx-auto mb-8 text-base text-blue-100 sm:mb-10 lg:mb-12 sm:text-lg lg:text-xl dark:text-gray-200 dark:text-opacity-90"
				>
					Join thousands of developers who write better commit messages and
					maintain cleaner project histories. Start your journey to professional
					Git practices today.
				</p>

				<div
					className="flex flex-col justify-center gap-3 mb-8 sm:gap-4 lg:gap-6 sm:mb-10 lg:mb-12 sm:flex-row"
					role="group"
					aria-label="Call to action buttons"
				>
					<Link href="/interactive-practice">
						<Button
							size="lg"
							className="w-full px-8 py-4 text-base font-semibold text-white transition-all duration-300 transform rounded-lg shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 focus:ring-4 focus:ring-emerald-300 dark:from-emerald-400 dark:to-teal-500 dark:hover:from-emerald-500 dark:hover:to-teal-600 dark:focus:ring-emerald-400 hover:shadow-xl dark:shadow-emerald-500/25 dark:hover:shadow-emerald-500/40 sm:w-auto hover:scale-105"
							aria-describedby="cta-description"
						>
							<span className="flex items-center">
								Start Practicing Now
								{getFontAwesomeIcon(
									'Zap',
									'w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2',
								)}
							</span>
						</Button>
					</Link>
					<Link href="/guide">
						<Button
							variant="outline"
							size="lg"
							className="w-full px-8 py-4 text-base font-semibold text-orange-700 transition-all duration-300 transform border-2 border-orange-300 rounded-lg shadow-lg bg-orange-50 hover:bg-orange-100 hover:border-orange-400 hover:text-orange-800 focus:ring-4 focus:ring-orange-300 dark:text-white dark:bg-orange-50 dark:border-orange-400 dark:hover:bg-orange-100 dark:hover:border-orange-900 dark:hover:text-white dark:focus:ring-orange-400 hover:shadow-xl dark:shadow-orange-400/20 dark:hover:shadow-orange-400/30 sm:w-auto hover:scale-105"
							aria-describedby="cta-description"
						>
							<span className="flex items-center">
								Read the Guide
								{getFontAwesomeIcon(
									'Book',
									'w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2',
								)}
							</span>
						</Button>
					</Link>
					<Link href="/generator">
						<Button
							variant="outline"
							size="lg"
							className="w-full px-8 py-4 text-base font-semibold text-purple-700 transition-all duration-300 transform border-2 border-purple-300 rounded-lg shadow-lg bg-purple-50 hover:bg-purple-100 hover:border-purple-400 hover:text-purple-800 focus:ring-4 focus:ring-purple-300 dark:text-purple-100 dark:bg-purple-900/30 dark:border-purple-400 dark:hover:bg-purple-900/40 dark:hover:border-purple-300 dark:hover:text-purple-50 dark:focus:ring-purple-400 hover:shadow-xl dark:shadow-purple-400/20 dark:hover:shadow-purple-400/30 sm:w-auto hover:scale-105"
							aria-describedby="cta-description"
						>
							<span className="flex items-center">
								Try Generator
								{getFontAwesomeIcon(
									'Code',
									'w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2',
								)}
							</span>
						</Button>
					</Link>
				</div>

				<div className="pt-6 border-t border-blue-400 sm:pt-8 dark:border-slate-600">
					<p className="text-sm text-blue-100 sm:text-base dark:text-gray-300 dark:text-opacity-90">
						Built with ❤️ by{' '}
						<span className="font-semibold text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400 dark:bg-clip-text dark:text-transparent">
							Amol Rathod
						</span>{' '}
						for the developer community
					</p>
				</div>
			</div>
		</section>
	)
}
