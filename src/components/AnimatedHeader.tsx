interface AnimatedHeaderProps {
	badge?: string
	title: string
	description: string
	className?: string
}

export default function AnimatedHeader({
	badge,
	title,
	description,
	className = '',
}: AnimatedHeaderProps) {
	return (
		<div className={`mb-8 text-center ${className}`}>
			{badge && (
				<div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-indigo-700 bg-indigo-100 rounded-full animate-fade-in dark:text-indigo-300 dark:bg-indigo-900/30">
					<div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
					{badge}
				</div>
			)}
			<h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white animate-slide-up">
				{title}
			</h1>
			<p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 animate-slide-up">
				{description}
			</p>
		</div>
	)
}
