'use client'

export function HowItWorksSection() {
	return (
		<section
			className="px-4 py-20 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-900 dark:to-slate-800"
			aria-labelledby="howitworks-title"
		>
			<div className="mx-auto max-w-7xl">
				<div className="mb-8 text-center sm:mb-12 lg:mb-16">
					<h2
						id="howitworks-title"
						className="mb-4 text-2xl font-bold text-gray-900 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl dark:text-white"
					>
						<span className="text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 dark:from-blue-400 dark:via-purple-400 dark:to-emerald-400 bg-clip-text">
							How It Works
						</span>
					</h2>
					<p className="max-w-3xl px-4 mx-auto text-base text-gray-600 sm:text-lg lg:text-xl dark:text-gray-200 dark:text-opacity-90">
						Get started in minutes and transform your Git workflow
					</p>
				</div>

				<div
					className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 xl:grid-cols-3"
					role="list"
				>
					<div
						className="p-6 text-center transition-all duration-300 rounded-lg shadow-lg bg-white/50 dark:bg-slate-800/50 dark:border dark:border-slate-700 hover:shadow-xl hover:scale-105 dark:shadow-slate-900/20 dark:hover:shadow-white/20"
						role="listitem"
					>
						<div
							className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-2xl font-bold text-white transition-all duration-300 bg-blue-600 rounded-lg dark:bg-blue-500 dark:shadow-lg dark:shadow-blue-500/25 hover:scale-110"
							aria-label="Step 1"
						>
							1
						</div>
						<h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white dark:bg-gradient-to-r dark:from-blue-400 dark:to-purple-400 dark:bg-clip-text dark:text-transparent">
							Learn & Explore
						</h3>
						<p className="text-gray-600 dark:text-gray-200 dark:text-opacity-90">
							Start with our comprehensive guide and browse real-world examples
							from popular open-source projects to understand conventional
							commit patterns.
						</p>
					</div>

					<div
						className="p-6 text-center transition-all duration-300 rounded-lg shadow-lg bg-white/50 dark:bg-slate-800/50 dark:border dark:border-slate-700 hover:shadow-xl hover:scale-105 dark:shadow-slate-900/20 dark:hover:shadow-white/20"
						role="listitem"
					>
						<div
							className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-2xl font-bold text-white transition-all duration-300 bg-green-600 rounded-lg dark:bg-green-500 dark:shadow-lg dark:shadow-green-500/25 hover:scale-110"
							aria-label="Step 2"
						>
							2
						</div>
						<h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white dark:bg-gradient-to-r dark:from-green-400 dark:to-emerald-400 dark:bg-clip-text dark:text-transparent">
							Practice & Validate
						</h3>
						<p className="text-gray-600 dark:text-gray-200 dark:text-opacity-90">
							Use our interactive practice exercises, commit generator, and
							validator to hone your skills with instant feedback and guidance.
						</p>
					</div>

					<div
						className="p-6 text-center transition-all duration-300 rounded-lg shadow-lg bg-white/50 dark:bg-slate-800/50 dark:border dark:border-slate-700 hover:shadow-xl hover:scale-105 dark:shadow-slate-900/20 dark:hover:shadow-white/20"
						role="listitem"
					>
						<div
							className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-2xl font-bold text-white transition-all duration-300 bg-purple-600 rounded-lg dark:bg-purple-500 dark:shadow-lg dark:shadow-purple-500/25 hover:scale-110"
							aria-label="Step 3"
						>
							3
						</div>
						<h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white dark:bg-gradient-to-r dark:from-purple-400 dark:to-pink-400 dark:bg-clip-text dark:text-transparent">
							Master & Apply
						</h3>
						<p className="text-gray-600 dark:text-gray-200 dark:text-opacity-90">
							Generate changelogs, train your team, and apply conventional
							commits in real projects for better documentation and
							collaboration.
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
